/* eslint-disable no-console */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
// const commandLineArgs = require('command-line-args');
const googleTranslate = require('google-translate');

const { GOOGLE_API_KEY } = process.env;
if (!GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY missing');
  // eslint-disable-next-line no-undef
  exit(1);
}

const googleTranslateInstance = googleTranslate(GOOGLE_API_KEY);

const baseData = require(path.resolve(process.cwd(), 'app/translations/en.json'));

const targetLang = process.argv[2] || 'zh-CN';

let targetData;
const targetPath = path.resolve(process.cwd(), `app/translations/${targetLang}.json`);

if (fs.existsSync(targetPath)) {
  targetData = require(targetPath); // eslint-disable-line
} else {
  targetData = {};
}

const translateSet = [];
const updatedTargetData = {};

Object.keys(baseData).forEach((key) => {
  if (targetData[key]) {
    updatedTargetData[key] = targetData[key];
    return;
  }
  translateSet.push([key, baseData[key]]);
});

if (translateSet.length === 0) {
  console.log('no new text for translate.');

  if (Object.keys(updatedTargetData).length !== Object.keys(targetData).length) {
    console.log('has some clean up');
    fs.writeFileSync(targetPath, JSON.stringify(updatedTargetData, Object.keys(updatedTargetData).sort(), 2));
    console.log(`${targetLang} translation updated. path: ${targetPath}`);
  }
  return;
}

const translateText = translateSet.map((i) => i[1]);

googleTranslateInstance.translate(translateText, 'en', targetLang, (err, translations) => {
  if (err) {
    console.log(err);
    return;
  }
  if (translateSet.length === 1) {
    updatedTargetData[translateSet[0][0]] = translations.translatedText;
  } else {
    translateSet.forEach(([key], index) => {
      updatedTargetData[key] = translations[index].translatedText
    });
  }
  fs.writeFileSync(targetPath, JSON.stringify(updatedTargetData, Object.keys(updatedTargetData).sort(), 2));
  console.log(`${targetLang} translation updated. path: ${targetPath}`);
});



