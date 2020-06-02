import { stringify } from 'query-string';
import getConfig from 'next/config'

function openShareWindow(
  url,
  options = 'dependent,width=600,height=400,resizable,centerscreen'
) {
  window.open(url, '_black', options);
}
export function shareToWeibo(data) {
  const { title, url, source, sourceUrl } = data;
  const endpoint = 'http://v.t.sina.com.cn/share/share.php';
  // TODO: make this configurable;
  const { publicRuntimeConfig } = getConfig();
  const query = stringify({
    appkey: publicRuntimeConfig.share.weibo.appKey,
    title,
    url,
    source,
    sourceUrl,
  });
  const windowUrl = `${endpoint}?${query}`;
  openShareWindow(windowUrl);
}

export function shareToFacebook(data) {
  const endpoint = 'https://www.facebook.com/dialog/feed';
  // eslint-disable-next-line
  const { publicRuntimeConfig } = getConfig();
  const display = 'popup';
  const query = stringify({
    app_id: publicRuntimeConfig.share.facebook.appId,
    display,
    link: data.link,
  });
  const windowUrl = `${endpoint}?${query}`;
  openShareWindow(windowUrl);
}

export function shareToLinkedIn(data) {
  const endpoint = 'https://www.linkedin.com/shareArticle';
  const { title, summary, source, url, mini = true } = data;
  const query = stringify({
    title,
    summary,
    source,
    url,
    mini,
  });
  const windowUrl = `${endpoint}?${query}`;
  openShareWindow(windowUrl);
}

export function shareToTwitter(data) {
  const endpoint = 'https://twitter.com/intent/tweet';
  const { text, url, via } = data;
  const query = stringify({
    text,
    url,
    via,
  });
  const windowUrl = `${endpoint}?${query}`;
  openShareWindow(windowUrl);
}

export function shareWithEmail(data) {
  const { subject, to, body } = data;
  const query = stringify({
    to,
    subject,
    body,
  });
  const anchor = document.createElement('a');
  anchor.href = `mailto:?${query}`;
  anchor.click();
}
