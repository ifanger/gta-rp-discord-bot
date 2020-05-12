import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { ApplicationForm } from '@model/application-form';
import LowRepository from '@repository/low-repository';

@injectable()
export default class FormsRepository {
  @inject(LowRepository) private _lowRepository: LowRepository;

  getDatabase() {
    return this._lowRepository.getInstance();
  }

  getByDiscordId = async (discordId: string) => {
    return this.getDatabase()
      .get('forms')
      .find((form: ApplicationForm) => form.userId === discordId)
      .value();
  };

  getByRpId = async (rpId: string) => {
    return this.getDatabase()
      .get('forms')
      .find((form: ApplicationForm) => form.rpId === rpId)
      .value();
  };

  delete = async (discordId: string) =>
    this.getDatabase().get('forms').remove({ userId: discordId }).write();

  update = async (form: ApplicationForm) =>
    this.getDatabase()
      .get('forms')
      .find({ userId: form.userId })
      .assign(form)
      .write();

  create = async (form: ApplicationForm) =>
    this.getDatabase().get('forms').push(form).write();
}
