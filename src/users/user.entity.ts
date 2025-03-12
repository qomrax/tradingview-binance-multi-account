import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm'; // CHANGE !!
import { Exclude } from 'class-transformer';
import { HttpErrorLocal } from 'src/error/http-error-local';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
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

    @OneToMany(() => HttpErrorLocal, error => error.user) // CHANGE !!
    errors: HttpErrorLocal[];
}