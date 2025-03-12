import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'; // CHANGE !!
import { User } from 'src/users/user.entity';
@Entity()
export class HttpResponseLocal {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.responses)
    user: User;

    @Column({ type: String })
    response: string

    @Column({ type: Date })
    date: Date

    @Column({ default: false, type: String })
    additionalMessage?: string
}
