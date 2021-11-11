import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class TimeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  height: number;

  @Column()
  width: number;

  @Column()
  time: number;
}
