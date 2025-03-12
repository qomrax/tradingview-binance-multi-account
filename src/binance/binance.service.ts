import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { OpenPositionDto } from './dto/create-position';
import { PositionService } from './position/position.service';
import { ClientManagerService } from './client-manager/client-manager.service';
import { CustomerClient } from './client-manager/customer-client';
import Client, { Binance } from 'binance-api-node';

@Injectable()
export class BinanceService {
    constructor(private clientManagerService: ClientManagerService) {

    }

    async test() {
        function write(data: any, name: string) {
            writeFileSync(`data/${new Date().getTime()}-${name}.json`, JSON.stringify(data, null, 4))
        }

        const data = await this.clientManagerService.getFuturesMarkPrice("XRPUSDT")
        write(data, "getFuturesMarkPrice")
    }

    async webhook(data: OpenPositionDto) {
        return await this.clientManagerService.openPositionForAllClients(data.symbol, data.side)
    }


}
