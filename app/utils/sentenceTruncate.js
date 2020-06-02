export const getSentences = (text) => {
  const regexp = /.*?[!.?。？！\n\r]/g;
  const sentences = text.match(regexp);
  if (!sentences) {
    return [text];
  }
  return sentences;
};

const sentenceTruncate = (text, count) => {
  if (!text) {
    return '';
  }
  const sentences = getSentences(text);
  if (sentences.length < count) {
    return text;
  }
  const sentence = sentences[count - 1];
  const startIndex = text.indexOf(sentence);
  return text.slice(0, startIndex + sentence.length);
};

export default sentenceTruncate;
