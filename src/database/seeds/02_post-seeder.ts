import { PostEntity } from 'src/entities/post.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class PostSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoruManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(PostEntity);

    await repository.insert([
      {
        id: 1,
        title: 'Title1',
        content: 'Content1',
        user: { id: 1 },
      },
      {
        id: 2,
        title: 'Title1',
        content: 'Content1',
        user: { id: 1 },
      },
      {
        id: 3,
        title: 'Title1',
        content: 'Content1',
        user: { id: 1 },
      },
      {
        id: 4,
        title: 'Title1',
        content: 'Content1',
        user: { id: 1 },
      },
      {
        id: 5,
        title: 'Title1',
        content: 'Content1',
        user: { id: 1 },
      },
      {
        id: 6,
        title: 'Title1',
        content: 'Content1',
        user: { id: 1 },
      },
    ]);
  }
}
