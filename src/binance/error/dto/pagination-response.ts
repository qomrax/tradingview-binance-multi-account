import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { PaginationInputDto } from "./pagination.dto";

export class PaginationResponseDto extends PaginationInputDto {
    @IsNumber()
    @ApiProperty({ type: Number })
    total: number

    @IsNumber()
    @ApiProperty({ type: Number })
    totalPage: number
}