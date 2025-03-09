import { Injectable } from '@nestjs/common';
import { Binance, MarkPriceResult } from 'binance-api-node';
import { writeFileSync } from 'fs';

import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from 'src/binance/clients/clients.service';
import { OrderService } from './order/order.service';
import { CreatePositionDto } from './dto/create-position';
import { Settings } from 'src/settings/entity/settings.entity';



@Injectable()
export class BinanceService {
    constructor(private constantsService: ConstantsService, private settingsService: SettingsService, private usersService: UsersService, private clientsService: ClientsService, private orderService: OrderService) {
    }

    async test() {
        function write(data: any, name: string) {
            writeFileSync(`data/${new Date().getTime()}-${name}.json`, JSON.stringify(data, null, 4))
        }
        const data = await this.clientsService.runOnSingleClient<ReturnType<typeof this.openPosition>>(this.openPosition.bind(this))
        write(data, "open-position")
    }

    async webhook(data: CreatePositionDto) {
        const futuresMarkPrice = await this.clientsService.runOnSingleClient(async (client: Binance) => {
            return await client.futuresMarkPrice()
        })
        const settings = await this.settingsService.getSettings()

        const allPositions = await this.clientsService.runOnAllClients<ReturnType<typeof this.openPosition>>((async (client) => {
            return await this.openPosition(client, data, futuresMarkPrice, settings)
        }).bind(this))
    }


    async openPosition(client: Binance, position: CreatePositionDto, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        return {
            position: await this.orderService.openPosition(
                client, position.symbol, position.side, futuresMarkPrice, settings
            ),
            settings,
        }
    }
}
