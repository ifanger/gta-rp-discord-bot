import 'reflect-metadata';
import {
  Message,
  TextChannel,
  GuildChannelManager,
  RoleManager,
} from 'discord.js';
import config from '@src/config';
import { inject, injectable } from 'inversify';
import FormsRepository from '@repository/forms-repository';

@injectable()
export default class DiscordService {
  @inject(FormsRepository) private _formsRepository: FormsRepository;

  createPrivateChannel = async (
    discordId: string,
    channelManager: GuildChannelManager,
    roleManager: RoleManager,
    count: number
  ) => {
    const channel = await channelManager.create(`whitelist-${count}`, {
      type: 'text',
      userLimit: 2,
      parent: config.server.category,
    });

    const everyoneRole = this.getEveryoneRole(roleManager);

    await channel.overwritePermissions([
      { id: everyoneRole.id, deny: ['VIEW_CHANNEL'], type: 'role' },
      { id: discordId, allow: ['VIEW_CHANNEL'], type: 'member' },
    ]);

    return channel;
  };

  askForId = async (channel: TextChannel, memberId: string) => {
    const question = await channel.send(
      '*Qual o seu ID em nosso servidor?*\n\n:speech_left: _Seu ID foi exibido ao tentar conectar em nosso servidor, no FiveM._'
    );
    const response = await channel.awaitMessages(
      (message) => message.author.id === memberId && !isNaN(message.content),
      { max: 1, errors: ['time'], time: 60000 }
    );

    const id = response.first().content;

    await question.delete();
    await response.first().delete();

    return id;
  };

  askForName = async (channel: TextChannel, memberId: string) => {
    const question = await channel.send(
      '*Qual o seu nome (com sobrenome) na nossa cidade?*\n\n:speech_left: _Seu nome in-game._'
    );
    const response = await channel.awaitMessages(
      (message: Message) => message.author.id === memberId,
      { max: 1, errors: ['time'], time: 60000 }
    );

    const name = response.first().content;

    await question.delete();
    await response.first().delete();

    return name;
  };

  private getEveryoneRole(roleManager: RoleManager) {
    return roleManager.cache.find((r) => r.name === '@everyone');
  }
}
