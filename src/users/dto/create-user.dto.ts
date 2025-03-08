import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: 'user@mail.com',
        description: 'User email address.',
        required: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123!',
        description: 'User password (Min 6 char!)',
        minLength: 6,
        required: true
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        required: true,
        description: "Binance api key!",
    })
    @IsString()
    binanceApiKey: string

    @ApiProperty({
        required: true,
        description: "Binance api key!",
    })
    @IsString()
    binanceSecretKey: string
}