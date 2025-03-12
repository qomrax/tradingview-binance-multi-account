import { Injectable } from '@nestjs/common';
import { CustomerClient } from './customer-client';
import { UsersService } from 'src/users/users.service';
import { CreatePositionDto } from '../dto/create-position';
import { MarkPriceResult } from 'binance-api-node';
import { Settings } from 'src/settings/entity/settings.entity';
import { PositionService } from '../position/position.service';
import { ErrorService } from 'src/error/error.service';
@Injectable()
export class ClientManagerService {
    clients_: CustomerClient[] = []

    constructor(
        private usersService: UsersService,
        private positionService: PositionService,
        private errorService: ErrorService
    ) {
        this.getClients()
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
        this.clients = users.map(user => new CustomerClient(user, this.errorService));
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

    async getFuturesAccountInfo(customerClient: CustomerClient) {
        return await customerClient.client.futuresAccountInfo()
    }

    async getFuturesMarkPrice(symbol: string): Promise<number> {
        const price = await this.client.client.futuresPrices({ symbol })
        return Number(price[symbol])
    }

    async changeFuturesLeverage(customerClient: CustomerClient, symbol: string, leverage: number) {
        return await customerClient.client.futuresLeverage({ symbol, leverage })
    }

    async openPosition(customerClient: CustomerClient, position: CreatePositionDto, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        // CHANGE!!
        return {
            position: await this.positionService.openPosition(
                customerClient, position.symbol, position.side, futuresMarkPrice
            ),
            settings,
        }
    }

    async openMultiplePositions(data: CreatePositionDto, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        // CHANGE!!
        return await this.runOnAllClients<any>(async (customerClient: CustomerClient) => {
            const accountInfo = await this.getFuturesAccountInfo(customerClient); // CHANGE!!

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

            const { leverage } = await this.changeFuturesLeverage(customerClient, data.symbol, settings.leverage); // CHANGE!!

            if (leverage !== settings.leverage) {
                return {
                    position: {
                        status: false
                    }, settings
                }
            }
            return await this.openPosition(customerClient, data, futuresMarkPrice, settings)
        })
    }



}
