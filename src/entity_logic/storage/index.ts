import { SomethingDB } from '../../application_logic/repositories/something/repository';
import { SomethingEntity } from '../../data/something';

export class SomethingDbInterface {
  static getSomethingById = async (something_id: string) => await SomethingDB.getSomethingById(something_id);
  static upsertSomething = async (something: SomethingEntity) => await SomethingDB.upsertSomething(something);
}
