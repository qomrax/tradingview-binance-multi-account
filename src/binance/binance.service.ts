import { Injectable } from '@nestjs/common';
import Client, { Binance, FuturesAccountInfoResult, FuturesOrder, MarkPrice, MarkPriceResult } from 'binance-api-node';
import { writeFileSync } from 'fs';

import { OrderSide_LT } from 'binance-api-node';
import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from 'src/binance/clients/clients.service';
import { Settings } from 'src/settings/entity/settings.entity';
import { OrderService } from './order/order.service';
import { error } from 'console';
const GUARANTEE_BUFFER_FOR_POSITION_OPENING_PERCENTAGE = 0.10
const ORDER_TYPE = "MARKET"


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

    async openPosition(client: Binance) {
        const futuresMarkPrice = await client.futuresMarkPrice()
        const settings = await this.settingsService.getSettings()
        return {
            position: await this.orderService.openPosition(client, "XRPUSDT", "BUY", futuresMarkPrice, settings),
            settings,
        }
    }


}
