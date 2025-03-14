import { Global, Injectable } from '@nestjs/common';
import { HttpError as HttpErrorBinance } from 'binance-api-node';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { HttpErrorLocal } from './http-error-local.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Global()
@Injectable()
export class ErrorService {
    constructor(private usersService: UsersService, @InjectRepository(HttpErrorLocal) private errorRepository: Repository<HttpErrorLocal>) {
    }

    private async insert_(httpErrorBinance: HttpErrorBinance, userId: number, additionalMessage?: string) {
        const user = await this.usersService.findOne(userId)

        this.log(httpErrorBinance, user.email, additionalMessage)

        const httpError = this.errorRepository.create({
            code: httpErrorBinance.code,
            message: httpErrorBinance.message,
            url: httpErrorBinance.url,
            name: httpErrorBinance.name,
            date: new Date(),
            user,
        })

        await this.errorRepository.insert(httpError)
    }

    public async insert(httpErrorBinance: HttpErrorBinance, userId: number, additionalMessage?: string) {
        try {
            await this.insert_(httpErrorBinance, userId, additionalMessage)
        } catch (localErr) {
            console.log(`[${this.date}][${String(httpErrorBinance)} hata kaydedilemedi çünkü; ${String(localErr)}]`)
        }
    }

    log(httpErrorBinance: HttpErrorBinance, email: string, additionalMessage?: string) {
        if (additionalMessage) {
            console.log(`[${this.date}][${httpErrorBinance.code}][${httpErrorBinance.url}][${httpErrorBinance.message}][${email}][${additionalMessage}]`)
            return
        }
        console.log(`[${this.date}][${httpErrorBinance.code}][${httpErrorBinance.url}][${httpErrorBinance.message}][${email}]`)
    }

    private get date(): string {
        return new Date().toLocaleString('tr-TR');
    }

    public async pagination(page: number, limit: number) {
        const skip = (page - 1) * limit; // CHANGE !!
        const [data, total] = await this.errorRepository.findAndCount({ // CHANGE !!
            skip,
            take: 1000,
            relations: ["user"],
            order: {
                date: "DESC"
            }
        });

        return {
            data: data.map(item => {
                const { user } = item;
                delete item.user
                return {
                    ...item, email: user.email
                }
            }),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

}
