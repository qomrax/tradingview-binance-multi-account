import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: false, name: 'is_admin' })
    isAdmin: boolean;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ name: "binance_api_key" })
    binanceApiKey: string

    @Column({ name: "binance_secret_key" })
    binanceSecretKey: string
}