import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn
} from 'typeorm'

import { Task } from '@components/task/model'
import { User } from '@components/user/model'

@Entity()
export class Project {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    default: null
  })
  public title: string

  @Column({
    default: null,
    type: 'text'
  })
  public description: string

  @Column({
    default: false
  })
  public done: boolean

  @CreateDateColumn()
  public created: Timestamp

  @UpdateDateColumn()
  public updated: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.author)
  public author: User

  @ManyToMany(type => Task)
  @JoinTable()
  public tasks: Task[]
}
