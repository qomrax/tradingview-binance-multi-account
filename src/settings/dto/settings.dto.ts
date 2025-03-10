import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

const div100 = ({ value }) => {
    return value / 100
}

const multi100 = ({ value }) => {
    return value * 100 * 100 // second hundred for bypass first div100
}

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
    @Transform(div100)
    @IsNumber()
    @Min(0.01)
    @Max(1)
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
    @Transform(div100)
    @IsNumber()
    @Min(0.01)
    @Max(1)
    takeProfitPercentage: number;

    @ApiProperty({
        example: 5,
        description: 'Notional percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @Transform(div100)
    @IsNumber()
    @Min(0.01)
    @Max(1)
    stopLossPercentage: number;

    @IsNumber()
    @Min(1)
    @Max(15)
    maximumPosition: number;
}

export class SettingsResponseDto extends SettingsDto {
    @ApiProperty({
        example: 5,
        description: 'Notional percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @IsNumber()
    @Transform(multi100)
    stopLossPercentage: number;

    @ApiProperty({
        example: 5,
        description: 'Notional percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @IsNumber()
    @Transform(multi100)
    takeProfitPercentage: number;

    @ApiProperty({
        example: 5,
        description: 'Notional percentage for settings.',
        required: true,
        maximum: 100,
        minimum: 1
    })
    @IsNumber()
    @Transform(multi100)
    notionalPercentage: number;
}
