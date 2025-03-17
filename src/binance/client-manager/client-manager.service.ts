import { Injectable } from '@nestjs/common';
import { CustomerClient } from './customer-client';
import { UsersService } from 'src/users/users.service';
import { ErrorService } from 'src/binance/error/error.service';
import { ResponseService } from '../response/response.service';
import { PositionService } from '../position/position.service';
import { OrderSide_LT } from 'binance-api-node';

@Injectable()
export class ClientManagerService {
    clients_: CustomerClient[] = []

    constructor(
        private usersService: UsersService,
        private errorService: ErrorService,
        private responseService: ResponseService,
        private positionService: PositionService
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
        this.clients = users.map(user => new CustomerClient(user, this.errorService, this.responseService));
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

    async getFuturesMarkPrice(symbol: string): Promise<number> {
        const price = await this.client.client.futuresPrices({ symbol })
        return Number(price[symbol])
    }

    public async openPositionForAllClients(symbol: string, side: OrderSide_LT,) {
        const markPrice = await this.getFuturesMarkPrice(symbol)
        const positionParameters = await this.positionService.createPositionParameters(symbol, side, markPrice)
        const openPosition = this.positionService.openPosition(positionParameters)

        return {
            position: {
                symbol, side
            },
            result: await this.runOnAllClients(openPosition)
        }
    }

    public async closeTriggeredOrders() {

    }
}
