import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import LowRepository from '@repository/low-repository';

@injectable()
export default class CountRepository {
  @inject(LowRepository) private _lowRepository: LowRepository;

  getDatabase() {
    return this._lowRepository.getInstance();
  }

  incrementCount = async () =>
    this.getDatabase()
      .update('count', (current: number) => current + 1)
      .write();

  getCount = async () => this.getDatabase().get('count').value();

  resetCount = async () =>
    this.getDatabase()
      .update('count', (current: number) => 0)
      .write();
}
