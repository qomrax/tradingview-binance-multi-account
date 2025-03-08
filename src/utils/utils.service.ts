import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
    public async isFailed<T>(func: Function, params: any, bindThis?: any): Promise<{ data?: T, result: boolean }> {
        try {
            const data = await (bindThis ? await func.bind(bindThis)(...params) : await func(...params))
            return {
                data, result: false
            }
        } catch (err) {
            console.log(err)
            return {
                result: true,
            }
        }
    }
}
