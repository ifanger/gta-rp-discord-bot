import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Message, TextChannel, Client } from 'discord.js';
import CountRepository from '@repository/count-repository';
import config from '@src/config';
import DiscordService from '@service/discord-service';
import { ApplicationForm } from '@model/application-form';
import FormsRepository from '@repository/forms-repository';
import QuestionUtils from '@utils/question-utils';
import { numericEmojis, getEmojiNumber } from '@utils/emoji';
import RpRepository from '@repository/rp-repository';
import { loadingMessage, loadedMessage } from '@utils/messages';

/**
 * Whitelist Module
 */
@injectable()
export default class WhitelistService {
  @inject(CountRepository) private _countRepository: CountRepository;
  @inject(FormsRepository) private _formsRepository: FormsRepository;
  @inject(RpRepository) private _rpRepository: RpRepository;
  @inject(DiscordService) private _discordService: DiscordService;

  getCount = async () => await this._countRepository.getCount();

  /**
   * Whitelist Module initialization
   */
  init = async (client: Client) => {
    console.log('Inicializando bot...');
    await this.resetCounter();
    console.log('Contagem de canais de whitelist resetados.');

    console.log('Obtendo mensagens pendentes no canal de whitelist...');
    const channel = client.channels.cache.find(
      (ch) => ch.id === config.whitelist.channel
    ) as TextChannel;
    const messages = (await channel.messages.fetch()).array();

    if (messages && messages.length > 0) {
      for (let i = 0; i < messages.length; i++) {
        await messages[i].delete();
        console.log(`Mensagem ${i + 1} de ${messages.length} apagada.`);
      }
    } else {
      console.log('Nenhuma mensagem para apagar.');
    }

    await channel.send(config.whitelist.greeting);
    console.log('Mensagem de boas-vindas enviada no canal ' + channel.name);
  };

  /**
   * Message handler for Whitelist
   */
  handleMessage = async (client: Client, message: Message) => {
    if (message.author.id === client.user.id) {
      return;
    }

    const channelId = message.channel.id;

    if (channelId === config.whitelist.channel) {
      if (message.content === config.whitelist.command) {
        await this.handleStartCommand(message);
      } else if (message.content.startsWith(config.whitelist.addCommand)) {
        await this.handleAddUserCommand(message);
      } else if (message.content.startsWith(config.whitelist.removeCommand)) {
        await this.handleRemoveUserCommand(message);
      } else {
        await message.delete();
      }
    }
  };

  private handleAddUserCommand = async (message: Message) => {
    const commandHelperText = `Parâmetros inválidos.\n_Digite _\`${config.whitelist.addCommand} <FIVEM_ID>\`_ para adicionar um usuário à whitelist._`;

    await this.manageUserWhitelist(message, commandHelperText, true);
  };

  private handleRemoveUserCommand = async (message: Message) => {
    const commandHelperText = `Parâmetros inválidos.\n_Digite _\`${config.whitelist.removeCommand} <FIVEM_ID>\`_ para remover um usuário whitelist._`;

    await this.manageUserWhitelist(message, commandHelperText, false);
  };

  private manageUserWhitelist = async (
    message: Message,
    commandHelpText: string,
    whitelisted: boolean
  ) => {
    let response: Message;

    try {
      const { content, author } = message;

      if (!config.whitelist.managers.includes(author.id)) {
        throw 'Comando restrito aos gerenciadores de whitelist.';
      }

      if (!content.includes(' ')) {
        throw commandHelpText;
      }

      const rpId = content.split(' ')[1];

      if (isNaN(Number(rpId))) {
        throw 'O parâmetro FIVEM_ID deve ser um número inteiro.';
      }

      response = await message.channel.send(':clock1030: _Carregando..._');

      const validUser = await this._rpRepository.userExists(rpId);

      if (!validUser) {
        throw 'Usuário não encontrado em nosso banco de dados.';
      }

      await this.setUserWhitelisted(rpId, whitelisted);

      await response.edit(
        `Usuário ${rpId} ${
          whitelisted ? 'adicionado na' : 'removido da'
        } whitelist com sucesso!`
      );
      await response.delete({ timeout: config.whitelist.responseDuration });
    } catch (error) {
      await response.edit(`Houve um erro: ${error}`);
      await response.delete({ timeout: config.whitelist.responseDuration });
    } finally {
      await message.delete();
    }
  };

  private handleStartCommand = async (message: Message) => {
    await this._countRepository.incrementCount();
    const currentCount = await this._countRepository.getCount();

    const { author } = message;

    let applicationForm = await this._formsRepository.getByDiscordId(author.id);

    if (!applicationForm) {
      applicationForm = this.buildDefaultForm(author.id, currentCount);
      await this._formsRepository.create(applicationForm);
    }

    if (applicationForm.status === 1) {
      await message.delete();
      await author.send('*Você já realizou a whitelist em nosso servidor.*');
      return;
    }

    const tempChannel = await this._discordService.createPrivateChannel(
      'whitelist',
      author.id,
      message.guild.channels,
      message.guild.roles,
      currentCount,
      config.whitelist.category
    );

    await message.delete();

    try {
      await tempChannel.send(
        `Iniciando procedimento de **whitelist** com <@${author.id}>.`
      );

      const rpId = await this._discordService.sendNumericQuestion(
        '*Qual o seu ID em nosso servidor?*\n\n:speech_left: _Seu ID foi exibido ao tentar conectar em nosso servidor, no FiveM._',
        tempChannel,
        author.id
      );

      const userExistsInFiveM = await this._rpRepository.userExists(rpId);

      if (!userExistsInFiveM) {
        throw 'O ID informado não existe! Faça a primeira conexão e copie o ID.';
      }

      const isAlreadyWhitelisted = await this._rpRepository.isWhitelisted(rpId);

      if (isAlreadyWhitelisted) {
        throw 'Você já possui whitelist em nossa cidade.';
      }

      const rpName = await this._discordService.sendStringQuestion(
        '*Qual o seu nome (com sobrenome) na nossa cidade?*\n\n:speech_left: _Seu nome in-game._',
        tempChannel,
        author.id
      );

      if (rpName.length < 5 || !rpName.includes(' ') || rpName.length > 30) {
        throw 'O nome do seu personagem deve ser um nome composto (ex: Lucas Silva) com tamanho entre 5 e 30 caracteres.';
      }

      applicationForm.rpId = rpId;
      applicationForm.rpName = rpName;

      applicationForm = await this.startTest(
        message,
        applicationForm,
        tempChannel
      );

      await this.validateTest(applicationForm, tempChannel, message);
    } catch (ex) {
      await tempChannel.send(
        'Houve um problema durante a execução do teste, reporte aos administradores.'
      );

      if (ex) {
        await tempChannel.send(ex);
      }

      setTimeout(async () => {
        await tempChannel.delete();
      }, 10000);
    }
  };

  private validateTest = async (
    applicationForm: ApplicationForm,
    channel: TextChannel,
    message: Message
  ) => {
    const form = { ...applicationForm };
    const { score, rpName, rpId } = form;

    await channel.send(
      'Você finalizou o teste, aguarde enquanto eu verifico as respostas...'
    );

    setTimeout(async () => {
      if (score >= config.whitelist.minScore) {
        await this.setUserWhitelisted(rpId);
        await this.setUserNickname(message, rpName, rpId);
        await this.setUserRole(message, rpName, rpId);
        await this.sendWhitelistSuccessMessage(channel, score);

        form.status = 1;
        await this._formsRepository.update(form);
      } else {
        await this._formsRepository.delete(form.userId);
        await channel.send(`:no_entry: *Infelizmente você não foi aprovado em nosso teste.\n
        Você acertou ${score} de ${config.whitelist.questions.length}*, você deveria acertar no mínimo ${config.whitelist.minScore}.`);
      }

      setTimeout(() => this.deleteTempChannel(channel), 5000);
    }, 2000);
  };

  private setUserRole = async (
    message: Message,
    rpName: string,
    rpId: string
  ) => {
    try {
      const role = await message.guild.roles.fetch(config.whitelist.role);
      await message.member.roles.add(role);
    } catch {
      console.log(
        `Não foi possível adicionar cargo ${config.whitelist.role} ao ${rpName} | ${rpId}.`
      );
    }
  };

  private deleteTempChannel = async (channel: TextChannel) => channel.delete();

  private sendWhitelistSuccessMessage = async (
    channel: TextChannel,
    score: number
  ) => {
    await channel.send(`:white_check_mark: *Parabéns! Você foi aprovado em nossa Whitelist.\n
    Você acertou ${score} de ${config.whitelist.questions.length} questões.\n
    Seu acesso ao servidor já está liberado.*`);
  };

  private setUserWhitelisted = async (
    rpId: string,
    whitelisted: boolean = true
  ) => this._rpRepository.setWhitelisted(rpId, whitelisted);

  private setUserNickname = async (
    message: Message,
    rpName: string,
    rpId: string
  ) => {
    try {
      await message.member.setNickname(`${rpName} | ${rpId}`);
    } catch {
      console.log('No permission for setting Nickname.');
    }
  };

  private startTest = async (
    message: Message,
    form: ApplicationForm,
    channel: TextChannel
  ) => {
    const questionList = [...config.whitelist.questions];
    const { author } = message;
    const applicationForm = { ...form };

    for (let i = 0; i < questionList.length; i++) {
      if (applicationForm.messageId) {
        const existingMessage = await channel.messages.fetch(
          applicationForm.messageId
        );
        await existingMessage.delete();
      }

      const question = questionList[i];
      const sentMessage = await channel.send(
        `<@${author.id}>\n` +
          QuestionUtils.formatQuestion(question, i, questionList.length)
      );

      applicationForm.messageId = sentMessage.id;

      await QuestionUtils.appendReactions(sentMessage, question);

      await sentMessage.edit(
        sentMessage.content.replace(loadingMessage, loadedMessage)
      );

      const filter = (reaction, user) => {
        return (
          numericEmojis.includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      try {
        const collectedReactions = await sentMessage.awaitReactions(filter, {
          max: 1,
          time: 60000,
          errors: ['time'],
        });
        const reaction = collectedReactions.first();
        const reactionEmoji = reaction.emoji.name;
        const selectedAnswer = getEmojiNumber(reactionEmoji) - 1;

        if (question.answers[selectedAnswer].correct) {
          applicationForm.score += 1;
        }
      } catch {
        await channel.send(
          'Você demorou muito para responder, próxima questão!'
        );
      }
    }

    return applicationForm;
  };

  resetCounter = async () => {
    await this._countRepository.resetCount();
  };

  private buildDefaultForm = (
    authorId: string,
    count: number
  ): ApplicationForm => ({
    userId: authorId,
    messageId: undefined,
    status: 0,
    score: 0,
    rpId: '',
    rpName: '',
    index: count,
  });
}
