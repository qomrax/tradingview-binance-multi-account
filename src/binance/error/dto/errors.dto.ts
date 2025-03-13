import { PaginationResponseDto } from "./pagination-response";

import { ApiProperty } from "@nestjs/swagger";
import { HttpErrorLocalDto } from "./http-error.dto";

export class Errors {
    @ApiProperty({ type: PaginationResponseDto })
    pagination: PaginationResponseDto

    @ApiProperty({ type: [HttpErrorLocalDto] })
    data: HttpErrorLocalDto[]
}
