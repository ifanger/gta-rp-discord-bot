import 'reflect-metadata';
import Discord from 'discord.js';
import config from '@src/config';
import WhitelistService from '@service/whitelist-service';
import { container } from '@src/inversify.config';

class NiunDiscordBot {
  private client = new Discord.Client();
  private whitelistService = container.resolve<WhitelistService>(
    WhitelistService
  );

  onMessageReceived = async (message: Discord.Message) => {
    this.whitelistService.handleMessage(this.client, message);
  };

  onDisconnected = async () => {
    console.log('Desconectado');
  };

  onConnected = async () => {
    await this.whitelistService.init(this.client);
  };

  runApp() {
    this.client.once('ready', this.onConnected);
    this.client.on('disconnect', this.onDisconnected);
    this.client.on('message', this.onMessageReceived);

    this.client.login(config.bot.token);
  }
}

const discordBot = new NiunDiscordBot();

discordBot.runApp();
