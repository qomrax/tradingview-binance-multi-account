import { Injectable } from '@nestjs/common';
import { Binance } from 'binance-api-node';
import { UsersService } from 'src/users/users.service';
import { CustomerClient } from './customer-client';
import { User } from 'src/users/user.entity';

@Injectable()
export class ClientsService {
    clients_: CustomerClient[] = [] // CHANGE!!

    constructor(private usersService: UsersService) {
        this.getClients();
    }

    set clients(clients: CustomerClient[]) { // CHANGE!!
        this.clients_ = clients
    }

    get clients(): CustomerClient[] { // CHANGE!!
        return this.clients_
    }

    get client(): CustomerClient { // CHANGE!!
        if (this.clients_.length === 0) {
            throw Error("There is no client!");
        }

        return this.clients_[0]
    }

    async getClients() {
        const users = await this.usersService.findAll();
        this.clients = users.map(user => new CustomerClient(user)); // CHANGE!!
    }

    async runOnAllClients<T>(operation: (client: CustomerClient) => T): Promise<T[]> {
        await this.getClients()
        return await Promise.all(this.clients.map((customerClient: CustomerClient) => {
            return operation(customerClient)
        }
        ))
    }

    async runOnSingleClient<T>(operation: (client: CustomerClient) => T): Promise<T> {
        await this.getClients()

        return await operation(this.client) // CHANGE!!
    }

    async getFuturesAccountInfo(customerClient: CustomerClient) { // CHANGE!!
        return await customerClient.client.futuresAccountInfo() // CHANGE!!
    }

    async getFuturesMarkPrice(customerClient: CustomerClient) { // CHANGE!!
        return await customerClient.client.futuresMarkPrice() // CHANGE!!
    }

    async changeFuturesLeverage(customerClient: CustomerClient, symbol: string, leverage: number) { // CHANGE!!
        return await customerClient.client.futuresLeverage({ symbol, leverage }) // CHANGE!!
    }
}