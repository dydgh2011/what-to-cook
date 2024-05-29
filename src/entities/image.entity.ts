import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'image' })
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'content',
    nullable: false,
    select: true,
  })
  path: string;

  // @ApiHideProperty()
  // @ManyToOne(() => PostEntity, (post) => post.images)
  // @JoinColumn({
  //   name: 'postId',
  // })
  // post: PostEntity;
}
