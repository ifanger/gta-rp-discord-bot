import { ApplicationForm } from "./application-form";

export type DbSchema = {
  forms: ApplicationForm[];
  count: number;
};