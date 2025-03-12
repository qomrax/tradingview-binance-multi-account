import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { OrderSide_LT } from 'binance-api-node';

export class OpenPositionDto {
    @ApiProperty({
        example: "XRPUSDT",
        description: 'Coin pair.',
    })
    @IsString()
    symbol: string;

    @ApiProperty({
        example: "SELL",
        description: "Position side"
    })
    @IsIn(["SELL", "BUY"])
    @IsString()
    side: OrderSide_LT
}