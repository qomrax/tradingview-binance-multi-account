import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
export class HttpErrorLocalDto {

    @ApiProperty({ type: CreateUserDto })
    user: CreateUserDto;

    @ApiProperty({ type: Number })
    code: number

    @ApiProperty({ type: String })
    message: string

    @ApiProperty({ type: String })
    url: string

    @ApiProperty({ type: String })
    name: string

    @ApiProperty({ type: Date })
    date: Date

    @ApiProperty({ default: false, type: String })
    additionalMessage?: string

    @ApiProperty({ type: String })
    email: string
}

