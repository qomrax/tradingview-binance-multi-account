import { Injectable } from '@nestjs/common';
import { CustomerClient } from './customer-client';
import { UsersService } from 'src/users/users.service';
import { CreatePositionDto } from '../dto/create-position';
import { MarkPriceResult } from 'binance-api-node';
import { Settings } from 'src/settings/entity/settings.entity';
import { PositionService } from '../position/position.service';
@Injectable()
export class ClientManagerService {
    clients_: CustomerClient[] = []

    constructor(
        private usersService: UsersService,
        private positionService: PositionService
    ) {
        this.getClients();
    }

    private set clients(clients: CustomerClient[]) {
        this.clients_ = clients
    }

    private get clients(): CustomerClient[] {
        return this.clients_
    }

    private get client(): CustomerClient {
        if (this.clients_.length === 0) {
            throw Error("There is no client!");
        }

        return this.clients_[0]
    }

    private async getClients() {
        const users = await this.usersService.findAll();
        this.clients = users.map(user => new CustomerClient(user));
    }

    async runOnAllClients<T>(operation: (client: CustomerClient) => Promise<T>): Promise<T[]> {
        await this.getClients()
        return await Promise.all(this.clients.map((customerClient: CustomerClient) => {
            return operation(customerClient)
        }
        ))
    }

    async runOnSingleClient<T>(operation: (client: CustomerClient) => Promise<T>): Promise<T> {
        await this.getClients()

        return await operation(this.client)
    }

    private async getFuturesAccountInfo(customerClient: CustomerClient) {
        return await customerClient.client.futuresAccountInfo()
    }

    private async getFuturesMarkPrice(customerClient: CustomerClient) {
        return await customerClient.client.futuresMarkPrice()
    }

    private async changeFuturesLeverage(customerClient: CustomerClient, symbol: string, leverage: number) {
        return await customerClient.client.futuresLeverage({ symbol, leverage })
    }

    async openPosition(client: CustomerClient, position: CreatePositionDto, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        return {
            position: await this.positionService.openPosition(
                client, position.symbol, position.side, futuresMarkPrice
            ),
            settings,
        }
    }

    async openMultiplePositions(data: CreatePositionDto, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        const allPositions = await this.runOnAllClients<any>(async (client: CustomerClient) => {
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
        })

        return allPositions;
    }
}
