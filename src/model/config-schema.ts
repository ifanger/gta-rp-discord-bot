export type ConfigSchema = {
  bot: BotSchema;
  server: ServerSchema;
  whitelist: WhitelistSchema[];
};

type BotSchema = {
  token: string;
};

type ServerSchema = {
  channel: string;
  category: string;
  greeting: string;
  command: string;
  minScore: number;
  mysql: MySqlSchema;
  whitelistFeedbackTimeout: number;
  channelDeletionTimeout: number;
};

type MySqlSchema = {
  host: string;
  port: number;
  user: string;
  password: string;
  db: string;
  tableOptions: TableOptionsSchema;
};

type TableOptionsSchema = {
  name: string;
  field: string;
  idField: string;
};

type WhitelistSchema = {
  question: string;
  answers: AnswersSchema[];
};

type AnswersSchema = {
  message: string;
  correct: boolean;
};
