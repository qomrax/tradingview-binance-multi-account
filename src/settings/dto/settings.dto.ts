//settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class SettingsDto {
    @ApiProperty({
        example: 1,
        description: 'Settings ID.',
        required: true,
        default: 1
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        example: 5,
        description: 'Notional percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @Transform(({ value }) => {
        return value / 100
    })
    @IsNumber()
    notionalPercentage: number;

    @ApiProperty({
        example: 10,
        description: 'Leverage for settings.',
        required: true
    })
    @IsNumber()
    leverage: number;

    @ApiProperty({
        example: 5,
        description: 'StopLoss percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @Transform(({ value }) => {
        return value / 100
    })
    @IsNumber()
    takeProfitPercentage: number;

    @ApiProperty({
        example: 5,
        description: 'Notional percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @Transform(({ value }) => {
        return value / 100
    })
    @IsNumber()
    stopLossPercentage: number;
}
