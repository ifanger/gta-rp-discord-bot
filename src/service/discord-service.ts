import 'reflect-metadata';
import {
  Message,
  TextChannel,
  GuildChannelManager,
  RoleManager,
} from 'discord.js';
import { injectable } from 'inversify';

@injectable()
export default class DiscordService {
  createPrivateChannel = async (
    name: string,
    discordId: string,
    channelManager: GuildChannelManager,
    roleManager: RoleManager,
    count: number,
    parentCategoryId?: string
  ) => {
    const channel = await channelManager.create(`${name}-${count}`, {
      type: 'text',
      userLimit: 2,
      parent: parentCategoryId,
    });

    const everyoneRole = this.getEveryoneRole(roleManager);

    await channel.overwritePermissions([
      { id: everyoneRole.id, deny: ['VIEW_CHANNEL'], type: 'role' },
      { id: discordId, allow: ['VIEW_CHANNEL'], type: 'member' },
    ]);

    return channel;
  };

  sendNumericQuestion = async (
    question: string,
    channel: TextChannel,
    memberId: string,
    timeout: number = 60000
  ) => {
    const questionMessage = await channel.send(question);

    const response = await channel.awaitMessages(
      (message) => message.author.id === memberId && !isNaN(message.content),
      { max: 1, errors: ['time'], time: timeout }
    );

    const id = response.first().content;

    await questionMessage.delete();
    await response.first().delete();

    return id;
  };

  sendStringQuestion = async (
    question: string,
    channel: TextChannel,
    memberId: string,
    timeout: number = 60000
  ) => {
    const questionMessage = await channel.send(question);

    const response = await channel.awaitMessages(
      (message: Message) => message.author.id === memberId,
      { max: 1, errors: ['time'], time: timeout }
    );

    const name = response.first().content;

    await questionMessage.delete();
    await response.first().delete();

    return name;
  };

  private getEveryoneRole(roleManager: RoleManager) {
    return roleManager.cache.find((r) => r.name === '@everyone');
  }
}
