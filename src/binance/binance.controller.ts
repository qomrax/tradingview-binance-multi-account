import { Request, Controller, Get, Post, Body } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { OpenPositionDto } from './dto/create-position';
import { FuturesOrderDto } from './dto/binance.dto';

@ApiTags('binance')
@Controller('binance')
export class BinanceController {
    private queue: any[] = [];
    private processing = false;

    constructor(private binanceService: BinanceService) { }

    private async addToQueue(task: () => Promise<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.processQueue();
        });
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        const { task, resolve, reject } = this.queue.shift();

        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.processing = false;
            await this.sleep(100);
            this.processQueue();
        }
    }

    @Post('tradingview-webhook')
    @ApiBody({
        type: OpenPositionDto
    })
    @ApiCreatedResponse({
        type: FuturesOrderDto,
        description: "Position created."
    })
    async webhook(@Body() createPositionDto: OpenPositionDto) {
        this.addToQueue(async () => {
            try {
                console.log("start", new Date().toLocaleString());
                const webhook = await this.binanceService.webhook(createPositionDto);
                console.log("sccs", new Date().toLocaleString());
                return webhook

            } catch (err) {
                console.log(err, new Date().toLocaleString());
            }
        });

        return { status: "ok" };
    }
}
