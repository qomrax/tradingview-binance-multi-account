import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { CreatePositionDto } from './dto/create-position';


@Injectable()
export class BinanceService {
    constructor() {
    }

    async test() {
        function write(data: any, name: string) {
            writeFileSync(`data/${new Date().getTime()}-${name}.json`, JSON.stringify(data, null, 4))
        }
    }

    async webhook(data: CreatePositionDto) {

    }


}
