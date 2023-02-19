import { faker } from '@faker-js/faker';
import { Seeder } from '../libraries/seeder';
import DB from '../databases/index';

/*
 *  in order to seeder work perfectly out of box
 * you need import exact path and  avoid using aliases path  for import file
 *
 *  cmd : npm run seeder --seed=../seeders/user.seeder.ts
 *  */

export default class UserSeeder extends Seeder {
  private model = DB.Users;


  async run(): Promise<void> {
    const dataSeed = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.future(),
    };

    await this.model.create(dataSeed);
  }
}
