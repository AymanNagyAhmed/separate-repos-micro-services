import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 , default: 'user'})
  role: string;

  @Column({ type: 'varchar', length: 255 , default: 'active'})
  status: string;

  @Column({ type: 'varchar', length: 255 , default: 'user'})
  gender: string;

  @Column({ type: 'varchar', length: 255 , default: 'user'})
  phone: string;

  @Column({ type: 'varchar', length: 255 , default: 'user'})
  avatar: string;

  @Column({ type: 'varchar', length: 255 , default: 'user'})
  createdAt: string;

  @Column({ type: 'varchar', length: 255 , default: 'user'})
  updatedAt: string;
}
