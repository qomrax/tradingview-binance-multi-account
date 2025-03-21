import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'yourpassword',
        description: 'User password',
    })
    @IsString()
    password: string;
}