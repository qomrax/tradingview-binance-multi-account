import { Injectable } from '@nestjs/common';
import { MarkPriceResult, Binance } from 'binance-api-node';
import { writeFileSync } from 'fs';
import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from 'src/binance/position/clients/clients.service';
import { OrderService } from './position/order/order.service';
import { CreatePositionDto } from './dto/create-position';
import { Settings } from 'src/settings/entity/settings.entity';
import { CustomerClient } from './position/clients/customer-client';
import { PositionService } from './position/position.service';


@Injectable()
export class BinanceService {
    constructor(private settingsService: SettingsService, private clientsService: ClientsService, private positionService: PositionService) {
    }

    async test() {
        function write(data: any, name: string) {
            writeFileSync(`data/${new Date().getTime()}-${name}.json`, JSON.stringify(data, null, 4))
        }

        const futuresAccountInfos = await this.clientsService.runOnAllClients<ReturnType<Binance["futuresAccountInfo"]>>(async (client: CustomerClient) => {
            try {
                const futuresAccountInfo = await client.client.futuresAccountInfo()
                write(futuresAccountInfo, "futuresAccountInfo")
                return futuresAccountInfo
            } catch (error: any) {
                console.log(client.user.email, error,)
            }
        })



        write(futuresAccountInfos, "futuresAccountInfos")
    }

    async webhook(data: CreatePositionDto) {
        const futuresMarkPrice = await this.clientsService.runOnSingleClient(async (client: CustomerClient) => {
            return await client.client.futuresMarkPrice()
        })
        const settings = await this.settingsService.getSettings()

        return this.openMultiplePositions(data, futuresMarkPrice, settings)
    }


    async openPosition(client: CustomerClient, position: CreatePositionDto, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        return {
            position: await this.positionService.openPosition(
                client.client, position.symbol, position.side, futuresMarkPrice
            ),
            settings,
        }
    }


    async openMultiplePositions(data: CreatePositionDto, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        const allPositions = await this.clientsService.runOnAllClients<ReturnType<typeof this.openPosition>>((async (client: CustomerClient) => {
            const accountInfo = await client.client.futuresAccountInfo()

            const canPositionOpen = async (): Promise<boolean> => {
                const openPositions = accountInfo.positions.map(position => ({
                    ...position,
                    positionAmt: Number(position.positionAmt)
                })).filter(position => position.positionAmt !== 0)

                if (openPositions.length >= settings.maximumPosition) {
                    return false
                }

                if (openPositions.find(position => position.symbol === data.symbol)) {
                    return false
                }

                return true
            }

            const isPositionOpen = await canPositionOpen()

            if (!isPositionOpen) {
                return {
                    position: {
                        status: false
                    }, settings
                }
            }

            const { leverage } = await client.client.futuresLeverage({ symbol: data.symbol, leverage: settings.leverage })

            if (leverage !== settings.leverage) {
                return {
                    position: {
                        status: false
                    }, settings
                }
            }
            return await this.openPosition(client, data, futuresMarkPrice, settings)
        }).bind(this))

        return allPositions;
    }
}
