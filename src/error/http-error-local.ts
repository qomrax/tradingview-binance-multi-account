import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'; // CHANGE !!
import { User } from 'src/users/user.entity';
@Entity()
export class HttpErrorLocal {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.errors) // CHANGE !!
    user: User;

    @Column({ type: Number })
    code: number

    @Column({ type: String })
    message: string

    @Column({ type: String })
    url: string

    @Column({ type: String })
    name: string

    @Column({ type: Date })
    date: Date

    @Column({ default: false, type: String })
    additionalMessage?: string
}
