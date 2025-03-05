import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('settings')
export class Settings {
    @PrimaryColumn({ default: 1, type: "int" })
    id: number = 1;

    @Column({
        type: "float",
        default: 0.25
    })
    notionalPercentage: number = 0.25

    @Column({
        type: "float",
        default: 0.05
    })
    takeProfitPercentage: number = 0.05

    @Column({
        type: "float",
        default: 0.05
    })
    stopLossPercentage: number = 0.05

    @Column({
        type: Number,
        default: 10
    })
    leverage: number = 10

    @Column({
        type: Number,
        default: 5
    })
    maximumPosition: number = 5


}
