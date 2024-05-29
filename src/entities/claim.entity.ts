import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'claim' })
export class ClaimEntity {
  @ApiProperty({
    description: 'The unique identifier for the claim',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'The operating system from which the claim was made',
    example: 'Windows 10',
  })
  @Column({
    type: 'varchar',
    name: 'os',
    length: 400,
    nullable: false,
    default: 'No content',
    select: true,
  })
  os: string;

  @ApiProperty({
    description: 'The browser from which the claim was made',
    example: 'Google Chrome',
  })
  @Column({
    type: 'varchar',
    name: 'browser',
    length: 400,
    nullable: false,
    default: 'No content',
    select: true,
  })
  browser: string;

  @ApiProperty({
    description: 'The message content of the claim',
    example: 'Page crashed when submitting form',
  })
  @Column({
    type: 'varchar',
    name: 'message',
    length: 400,
    nullable: false,
    default: 'No content',
    select: true,
  })
  message: string;

  @ApiProperty({
    description: 'The date and time when the claim was created',
    example: '2023-05-29T12:34:56Z',
  })
  @CreateDateColumn({
    name: 'created_at',
    select: true,
  })
  createdAt: Date;
}
