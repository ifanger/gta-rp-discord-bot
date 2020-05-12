import { loadingMessage } from '@utils/messages';
import { getEmojiNumber } from '@utils/emoji';

export default class QuestionUtils {
  static formatQuestion = (question, current, total) => {
    let message = '';

    message += `_Pergunta ${current + 1} de ${total}_\n`;
    message += `_:clock1: Você tem 1 minuto por pergunta!_\n\n`;
    message += `>>> :small_orange_diamond:  **${question.question}**\n`;

    question.answers.forEach((answer, index) => {
      message += `\n${getEmojiNumber(index + 1)} ` + answer.message;
    });

    message += `\n\n${loadingMessage}`;

    return message;
  };

  static appendReactions = async (message, question) => {
    for (var i = 0; i < question.answers.length; i++) {
      await message.react(getEmojiNumber(i + 1));
    }
  };
}
