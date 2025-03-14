import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { OrderSide_LT } from 'binance-api-node';
import { Transform } from 'class-transformer';

export class OpenPositionDto {
    @ApiProperty({
        example: "XRPUSDT.P",
        description: 'Coin pair.',
    })
    @Transform(({ value }: { value: string }) => {
        const upperCased = value.toUpperCase()
        const replaced = upperCased.replace(".P", "")
        return replaced
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

export class OpenPositionWithAuth extends OpenPositionDto {
    @ApiProperty({
        example: "secretpassword",
        description: "Crude auth for tradingview webhooks."
    })
    @IsString()
    key: string
}
