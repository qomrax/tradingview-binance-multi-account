import { Request, Controller, Get, Post, Body } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { CreatePositionDto } from './dto/create-position';
import { FuturesOrderDto } from './dto/binance.dto';
@ApiTags('binance')
@Controller('binance')
export class BinanceController {
    constructor(private binanceService: BinanceService) { }

    @Get('test')
    async test() {
        await this.binanceService.test()
    }


    @Post('create-position')
    @ApiBody({
        type: CreatePositionDto
    })
    @ApiCreatedResponse({
        type: FuturesOrderDto,
        description: "Position created."
    })
    async createPosition(@Body() createPositionDto: CreatePositionDto) {
        // const futuresAccountInfo = await this.binanceService.getFuturesAccountInfo()
        // const futuresMarkPrice = await this.binanceService.getFuturesMarkPrice()

        // return await this.binanceService.openFuturesMarketOrder(createPositionDto.symbol, createPositionDto.side, futuresAccountInfo, futuresMarkPrice, 0.5)
    }

}
