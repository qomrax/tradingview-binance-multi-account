import { Injectable } from '@nestjs/common';
import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';

import { PositionParameters } from './position-parameters';
import { Position } from './position';
import { OrderSide_LT } from 'binance-api-node';
import { CustomerClient } from '../client-manager/customer-client';
@Injectable()
export class PositionService {
    constructor(
        private constantsService: ConstantsService,
        private settingsService: SettingsService,
    ) {
    }

    async createPositionParameters(symbol: string, side: OrderSide_LT, markPrice: number) {
        return await PositionParameters.create(symbol, side, markPrice, this.constantsService, this.settingsService)
    }

    async createPosition(customerClient: CustomerClient, positionParameters: PositionParameters) {
        return await Position.create(customerClient, positionParameters, this.constantsService)
    }

    openPosition(positionParameters: PositionParameters) {
        const openPosition = async (customerClient: CustomerClient) => {
            const position = await this.createPosition(customerClient, positionParameters)
            return {
                [customerClient.user.email]: await position.openPosition()
            }
        }

        return openPosition.bind(this)
    }
}

