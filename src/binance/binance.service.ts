import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { OpenPositionDto } from './dto/create-position';
import { ClientManagerService } from './client-manager/client-manager.service';

@Injectable()
export class BinanceService {
    constructor(private clientManagerService: ClientManagerService) {

    }

    async test() {
        function write(data: any, name: string) {
            writeFileSync(`data/${new Date().getTime()}-${name}.json`, JSON.stringify(data, null, 4))
        }

        write(await this.clientManagerService.runOnSingleClient(client => {
            return client.client.futuresExchangeInfo()
        }), "exchange-info")

    }

    async webhook(data: OpenPositionDto) {
        return await this.clientManagerService.openPositionForAllClients(data.symbol, data.side)
    }


}
