// src/clients/customer-client.ts
import Client, { Binance, HttpError } from 'binance-api-node';
import { ErrorService } from 'src/error/error.service';
import { User } from 'src/users/user.entity';

export class CustomerClient {
    client: Binance
    constructor(public user: User, private errorService: ErrorService) {
        this.client = Client({
            apiKey: this.user.binanceApiKey,
            apiSecret: this.user.binanceSecretKey
        })
    }

    async error(httpError: HttpError) {
        await this.errorService.insert(httpError, this.user.id)
    }
}
