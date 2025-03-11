// src/clients/customer-client.ts
import Client, { Binance } from 'binance-api-node';
import { User } from 'src/users/user.entity';

export class CustomerClient {
    client: Binance
    constructor(public user: User) {
        this.client = Client({
            apiKey: this.user.binanceApiKey,
            apiSecret: this.user.binanceSecretKey
        })
    }
}
