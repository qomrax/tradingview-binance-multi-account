import { Injectable } from '@nestjs/common';
import { Binance, MarkPriceResult } from 'binance-api-node';
import { writeFileSync } from 'fs';

import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from 'src/binance/clients/clients.service';
import { OrderService } from './order/order.service';
import { CreatePositionDto } from './dto/create-position';
import { Settings } from 'src/settings/entity/settings.entity';
import { CustomerClient } from './clients/customer-client';


@Injectable()
export class BinanceService {
    constructor(private settingsService: SettingsService, private usersService: UsersService, private clientsService: ClientsService, private orderService: OrderService) {
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

        const allPositions = await this.clientsService.runOnAllClients<ReturnType<typeof this.openPosition>>((async (client: Binance) => {
            const accountInfo = await client.futuresAccountInfo()

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

            const { leverage } = await client.futuresLeverage({ symbol: data.symbol, leverage: settings.leverage })

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


    async openPosition(client: Binance, position: CreatePositionDto, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        return {
            position: await this.orderService.openPosition(
                client, position.symbol, position.side, futuresMarkPrice, settings
            ),
            settings,
        }
    }
}
