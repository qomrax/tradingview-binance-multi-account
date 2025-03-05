import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from './entity/settings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(Settings)
        private readonly settingsRepository: Repository<Settings>,
    ) {
        this.crateSettings()
    }

    async getSettings(): Promise<Settings> {
        return await this.settingsRepository.findOne({ where: { id: 1 } });
    }

    async setSettings(updateData: Partial<Settings>): Promise<Settings> {
        console.log(updateData)
        console.log(await this.settingsRepository.update(1, updateData))
        return this.getSettings();
    }

    async crateSettings(): Promise<Settings> {
        const exists = await this.settingsRepository.findOne({ where: { id: 1 } });
        if (!exists) {
            const newSettings = new Settings();
            await this.settingsRepository.save(newSettings);
        }

        return exists
    }
}
