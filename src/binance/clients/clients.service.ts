import { Injectable } from '@nestjs/common';
import Client, { Binance } from 'binance-api-node';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ClientsService {
    clients_: Binance[] = []

    constructor(private usersService: UsersService) {
        this.getClients();
    }

    set clients(clients: Binance[]) {
        this.clients_ = clients
    }

    get clients(): Binance[] {
        return this.clients_
    }

    get client(): Binance {
        if (this.clients_.length === 0) {
            throw Error("There is no client!");
        }

        return this.clients_[0]
    }

    async getClients(): Promise<Binance[]> {
        return (await this.usersService.findAll()).map(user => Client({
            apiKey: user.binanceApiKey,
            apiSecret: user.binanceSecretKey
        }))
    }

    async runOnAllClients<T>(operation: (client: Binance) => T): Promise<T[]> {
        await this.getClients()

        return await Promise.all(this.clients.map((client: Binance) => operation(client)))
    }

    async runOnSingleClient<T>(operation: (client: Binance) => T): Promise<T> {
        await this.getClients()

        return await operation(this.client)
    }

    async getFuturesAccountInfo(client: Binance) {
        return await client.futuresAccountInfo()
    }

    async getFuturesMarkPrice(client: Binance) {
        return await client.futuresMarkPrice()
    }

    async changeFuturesLeverage(client: Binance, symbol: string, leverage: number) {
        return await client.futuresLeverage({ symbol, leverage })
    }
}


