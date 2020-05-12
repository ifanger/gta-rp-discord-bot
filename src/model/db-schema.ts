import { ApplicationForm } from '@model/application-form';

export type DbSchema = {
  forms: ApplicationForm[];
  count: number;
};
