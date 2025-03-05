//settings.controller.ts

import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    @ApiOperation({ summary: 'Get current settings' })
    @ApiResponse({ status: 200, description: 'Current settings', type: SettingsDto })
    async getSettings(): Promise<SettingsDto> {
        return this.settingsService.getSettings();
    }

    @Put()
    @ApiOperation({ summary: 'Update settings' })
    @ApiResponse({ status: 200, description: 'Settings successfully updated', type: SettingsDto })
    @ApiBody({ type: UpdateSettingsDto })
    async updateSettings(@Body() updateSettingsDto: UpdateSettingsDto): Promise<SettingsDto> {
        return this.settingsService.setSettings(updateSettingsDto);
    }

}
