import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { config } from 'dotenv';
import { ENV } from 'src/env/env.dto';

config();

@Injectable()
export class EnvService {
    public readonly envConfig: ENV;

    constructor() {
        const configInstance = plainToInstance(ENV, process.env, {
            enableImplicitConversion: true
        });

        const errors = validateSync(configInstance, {
            skipMissingProperties: false
        });

        if (errors.length > 0) {
            throw new Error(
                `⛔ Environment variables validation failed:\n${this.formatErrors(errors)}`
            );
        }

        this.envConfig = configInstance;
    }

    private formatErrors(errors: ValidationError[]): string {
        return errors
            .map((error: ValidationError) => {
                const constraints = error.constraints || {};
                const messages = Object.values(constraints)
                    .map((message: string) => `  • ${message}`)
                    .join('\n');

                return `➤ ${error.property}:\n${messages}`;
            })
            .join('\n\n');
    }

    get isDevelopment(): boolean {
        return this.envConfig.NODE_ENV !== 'production';
    }

    get isProduction(): boolean {
        return !this.isDevelopment;
    }

    get appUrl(): string {
        const path = `${this.envConfig.APP_PATH ? `/${this.envConfig.APP_PATH}` : ''}`

        if (this.isDevelopment) {
            return `${this.envConfig.APP_PROTOCOL}://${this.envConfig.APP_HOST}:${this.envConfig.APP_PORT}${path}`
        } else {
            return `${this.envConfig.APP_PROTOCOL}://${this.envConfig.APP_HOST}${path}`

        }
    }
}