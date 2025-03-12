import { Request, Controller, Get, Post, Body } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { OpenPositionDto } from './dto/create-position';
import { FuturesOrderDto } from './dto/binance.dto';
@ApiTags('binance')
@Controller('binance')
export class BinanceController {
    constructor(private binanceService: BinanceService) { }

    @Get('test')
    async test() {
        await this.binanceService.test()
    }

    @Post('tradingview-webhook')
    @ApiBody({
        type: OpenPositionDto
    })
    @ApiCreatedResponse({
        type: FuturesOrderDto,
        description: "Position created."
    })
    async webhook(@Body() createPositionDto: OpenPositionDto) {
        return await this.binanceService.webhook(createPositionDto)
    }

}
