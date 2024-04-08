import { UserEntity } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { hash } from 'bcrypt';
import { UserRole } from 'src/entities/data-types-for-entities';

export class UserSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoruManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);
    const encryptedPassword = await hash('Nam14135647!', 10);

    await repository.insert([
      {
        id: 1,
        email: 'dydgh2011@gmail.com',
        username: 'MarkNam',
        password: encryptedPassword,
        role: UserRole.ADMIN,
      },
      {
        id: 2,
        email: 'dontsend@gmail.com',
        username: 'JhonDoe1',
        password: encryptedPassword,
        role: UserRole.USER,
      },
      {
        id: 3,
        email: 'dont@gmail.com',
        username: 'JhonDoe2',
        password: encryptedPassword,
        role: UserRole.USER,
      },
      {
        id: 4,
        email: 'nomailtohere@gmail.com',
        username: 'JhonDoe3',
        password: encryptedPassword,
        role: UserRole.USER,
      },
    ]);
  }
}
