import { Injectable } from '@nestjs/common';
import { HttpResponseLocal } from './http-response';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ResponseService {
    constructor(private usersService: UsersService, @InjectRepository(HttpResponseLocal) private responseRepository: Repository<HttpResponseLocal>) {
    }

    private async insert_(response: any, userId: number, additionalMessage?: string) {
        const user = await this.usersService.findOne(userId)

        this.log(response, user.email, additionalMessage)

        const responseInstance = this.responseRepository.create({
            response: JSON.stringify(response),
            date: new Date(),
            user,
        })

        await this.responseRepository.insert(responseInstance)
    }

    public async insert(response: any, userId: number, additionalMessage?: string) {
        try {
            await this.insert_(response, userId, additionalMessage)
        } catch (localErr) {
            console.log(`[${this.date}][${String(response)} hata kaydedilemedi çünkü; ${String(localErr)}]`)
        }
    }

    log(response: any, email: string, additionalMessage?: string) {
        if (additionalMessage) {
            console.log(`[${this.date}][response][${email}][${additionalMessage}]`)
            return
        }
        console.log(`[${this.date}][response][${email}]`)
    }

    private get date(): string {
        return new Date().toLocaleString('tr-TR');
    }
}
