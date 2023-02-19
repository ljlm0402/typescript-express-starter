import DB from '../databases/index';
import { SeederInterface } from '../interfaces/seeder.interface';

export class Seeder implements SeederInterface {
  constructor() {
    // connect to data base
    DB.sequelize.sync({ force: false });
  }

  async run(): Promise<void> {
    //
  }
}
