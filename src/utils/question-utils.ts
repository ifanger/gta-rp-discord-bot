import config from '../config';
import { loadingMessage } from './messages';

export default class QuestionUtils {
  static formatQuestion = (question, current, total) => {
    let message = '';
    
    message += `_Pergunta ${current + 1} de ${total}_\n`;
    message += `_:clock1: Você tem 1 minuto por pergunta!_\n\n`;
    message += `>>> :small_orange_diamond:  **${question.question}**\n`;

    question.answers.forEach((answer, index) => {
      message += `\n${QuestionUtils.getNumberEmoji(index + 1)} ` + answer.message;
    });

    message += `\n\n${loadingMessage}`;

    return message;
  }

  static appendReactions = async (message, question) => {
    for (var i = 0; i < question.answers.length; i++) {
      await message.react(QuestionUtils.getNumberEmoji(i + 1));
    }
  }

  static getNumberEmoji = (number) => {
    switch (number) {
      case 1: return '1️⃣';
      case 2: return '2️⃣';
      case 3: return '3️⃣';
      case 4: return '4️⃣';
      case 5: return '5️⃣';
      case 6: return '6️⃣';
      case 7: return '7️⃣';
      case 8: return '8️⃣';
      case 9: return '9️⃣';
      case 10: return '🔟';
      default: return '0️⃣';
    }
  }
};
