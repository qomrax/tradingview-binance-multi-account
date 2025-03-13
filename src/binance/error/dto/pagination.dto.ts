import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class PaginationInputDto {

    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ type: Number })
    page: number

    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ type: Number })
    limit: number
}