// src/clients/customer-client.ts
import Client, { Binance, HttpError } from 'binance-api-node';
import { ErrorService } from 'src/binance/error/error.service';
import { User } from 'src/users/user.entity';
import { ResponseService } from '../response/response.service';

export class CustomerClient {
    client: Binance;

    constructor(public user: User, private errorService: ErrorService, private responseService: ResponseService) {
        const originalClient = Client({
            apiKey: this.user.binanceApiKey,
            apiSecret: this.user.binanceSecretKey
        });

        this.client = new Proxy(originalClient, {
            get: (target, prop) => {
                const member = target[prop];
                if (typeof member === 'function') {
                    return async (...args: any[]) => {
                        try {
                            const data = await member.apply(target, args);
                            this.response(member?.name).catch(console.log)
                            return data
                        } catch (error) {
                            await this.error(error);
                            throw error;
                        }
                    };
                }
                return member;
            }
        });
    }

    get error() {
        const error = async (httpError: HttpError) => {
            const error = this.errorService.insert(httpError, this.user.id)
            error.catch(console.log);
            return await error
        }

        return error.bind(this)
    }

    get response() {
        const response = async (httpResponse: any) => {
            return await this.responseService.insert(httpResponse, this.user.id)
        }

        return response.bind(this)
    }



}