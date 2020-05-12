const numericEmojis = [
  '0️⃣',
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
  '🔟',
];

const getEmojiNumber = (emoji) => {
  return numericEmojis.indexOf(emoji);
};

export { numericEmojis, getEmojiNumber };
