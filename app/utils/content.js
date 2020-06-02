function htmlToText(html) {
  if (typeof document === 'object') {
    const dom = document.createElement('div');
    dom.innerHTML = html;
    return dom.innerText.trim();
  }
  const regex = /(<([^>]+)>)/ig
  return html.replace(regex, '').trim()
}

export function maxTextContent(html, length) {
  const text = htmlToText(html)
  if (length && text.length > length) {
    return `${text.slice(0, length)}...`;
  }
  return text;
}

export function contentWithoutTitle(html) {
  if (!html) {
    return '';
  }
  const dom = document.createElement('div');
  dom.innerHTML = html;
  dom.removeChild(dom.children[0]);
  return dom.innerHTML;
}

export function getSentences(text) {
  const regexp = /.*?[!.?。？！\n\r]/g;
  const sentences = text.match(regexp);
  if (!sentences) {
    return [text];
  }
  return sentences;
}

export function sentenceTruncate(text, count) {
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
}

export function getText(html, maxLength) {
  const text = htmlToText(html);
  if (maxLength) {
    return prettyTruncate(text, maxLength);
  }
  return text
}

// truncate text, with words as unit
export function prettyTruncate(text, maxLength, ellipsis = '...') {
  if (text.length < maxLength) {
    return text;
  }
  const words = text.split(' ');
  const ellipsisLength = ellipsis ? ellipsis.length : 0;
  const maxContentLength = maxLength - ellipsisLength;

  if (words.length === 1) {
    return words.slice(0, maxContentLength) + (ellipsis || '');
  }

  let output = '';
  while (words.length && output.length < maxContentLength) {
    const next = `${output} ${words.shift()}`;
    if (next.length > maxLength) {
      break;
    }
    output = next;
  }

  return output + (ellipsis || '');
}
