//update-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { Min, Max } from 'class-validator';

export class UpdateSettingsDto {
    @ApiProperty({
        example: 5,
        description: 'Notional percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @Min(0.01)
    @Max(1)
    @Transform(({ value }) => {
        return value / 100
    })
    @IsNumber()

    notionalPercentage: number;

    @ApiProperty({
        example: 10,
        description: 'Leverage for settings.'
    })
    @IsNumber()
    leverage: number;

    @ApiProperty({
        example: 5,
        description: 'TakeProfit percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @Min(0.01)
    @Max(1)
    @Transform(({ value }) => {
        return value / 100
    })
    @IsNumber()
    takeProfitPercentage: number;

    @ApiProperty({
        example: 5,
        description: 'StopLoss percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @Min(0.01)
    @Max(1)
    @Transform(({ value }) => {
        return value / 100
    })
    @IsNumber()
    stopLossPercentage: number;

    @IsNumber()
    @Min(1)
    @Max(15)
    maximumPosition: number
}
