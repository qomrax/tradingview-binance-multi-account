import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
export class HttpResponseLocalDto {
    @ApiProperty({ type: CreateUserDto })
    user: CreateUserDto;

    @ApiProperty({ type: String })
    response: string

    @ApiProperty({ type: Date })
    date: Date

    @ApiProperty({ default: false, type: String })
    additionalMessage?: string
}