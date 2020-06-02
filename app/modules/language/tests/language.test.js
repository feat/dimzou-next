import reducer from '../reducer';

import {
  setLocale,
  changeLocale,
  loadTranslations,
  openTranslateLanguageSelect,
  enableTranslationMode,
  disableTranslationMode,
  closeTranslateLanguageSelect,
  openLanguageSelect,
  closeLanguageSelect,
  submitTranslation,
  fetchLocales,
  createLocale,
  fetchLanguages,
} from '../actions';

describe('Language Module', () => {
  let state = reducer(undefined, { type: 'INIT' });

  describe('locale related', () => {
    it('set Locale', () => {
      const action = setLocale({ locale: 'xx', localeLabel: 'xxx' });
      state = reducer(state, action);
      expect(state.locale).toBe('xx');
      expect(state.localeLabel).toBe('xxx');
    });
    it('change locale', () => {
      // locale entity
      const action = changeLocale({
        locale: 'demo',
        localeLabel: 'LocaleLabel',
      });
      state = reducer(state, action);
      expect(state.locale).toBe('demo');
      expect(state.localeLabel).toBe('LocaleLabel');
      expect(state.isLocaleSelectModalOpened).toBe(false);
    });

    describe('init change locale flow', () => {
      it('open locale select', () => {
        const action = openLanguageSelect();
        state = reducer(state, action);
        expect(state.isLocaleSelectModalOpened).toBe(true);
      });
      it('close locale select', () => {
        const action = closeLanguageSelect();
        state = reducer(state, action);
        expect(state.isLocaleSelectModalOpened).toBe(false);
      });
    });

    describe('fetch locale flow', () => {
      it('request', () => {
        const action = fetchLocales.request();
        state = reducer(state, action);
        expect(state.fetchingLocales).toEqual(true);
      });
      it('success', () => {
        const data = [{ id: 1, label: 'English' }];
        const action = fetchLocales.success(data);
        state = reducer(state, action);
        expect(state.locales).toEqual(data);
        expect(state.localesFetched).toBe(true);
      });
      it('fulfill', () => {
        const action = fetchLocales.fulfill();
        state = reducer(state, action);
        expect(state.fetchingLocales).toEqual(false);
      });
    });

    describe('create locale flow', () => {
      const locale = { id: 'NEW', label: 'DEMO' };
      const action = createLocale.success(locale);
      state = reducer(state, action);
      expect(state.locales).toContainEqual(locale);
    });

    describe('fetch language code flow', () => {
      // it('trigger', () => {});
      it('request', () => {
        const action = fetchLanguages.request();
        state = reducer(state, action);
        expect(state.fetchingLanguages).toBe(true);
      });
      it('success', () => {
        const data = [{ id: 1, language_code: 'en' }];
        const action = fetchLanguages.success(data);
        state = reducer(state, action);
        expect(state.languages).toBe(data);
      });
      // it('failure', () => {});
      it('fulfill', () => {
        const action = fetchLanguages.fulfill();
        state = reducer(state, action);
        expect(state.fetchingLanguages).toBe(false);
      });
    });
  });

  describe('translation related', () => {
    it('load translations, with public and user customize', () => {
      const action = loadTranslations({
        locale: 'en',
        translations: { a: 'A label' },
        userTranslations: { b: 'B label' },
      });
      state = reducer(state, action);
      expect(state.translations.en).toEqual({ a: 'A label' });
      expect(state.userTranslations.en).toEqual({ b: 'B label' });
    });
    describe('fetch translations flow', () => {
      it('request', () => {});
      it('fulfill', () => {});
    });

    describe('submit translation flow', () => {
      // it('trigger', () => {});
      // it('request', () => {});
      it('success', () => {
        const now = Date.now();
        const action = submitTranslation.success({
          locale: 'en',
          key: 'c',
          translation: 'C label',
          date: now,
        });
        state = reducer(state, action);
        expect(state.userTranslations.en.c).toEqual('C label');
        expect(state.fetched.en).toEqual(now);
      });
      // it('failure', () => {});
      // it('fulfill', () => {});
    });
    describe('init translation flow', () => {
      it('open language select panel', () => {
        const action = openTranslateLanguageSelect();
        state = reducer(state, action);
        expect(state.isTranslateLanguageSelectOpened).toBe(true);
      });
      it('enable translation mode', () => {
        const action = enableTranslationMode({
          locale: 'demo',
          label: 'Demo',
        });
        state = reducer(state, action);
        expect(state.isTranslateLanguageSelectOpened).toBe(false);
        expect(state.isTranslateModeEnabled).toBe(true);
        expect(state.translateLocale).toEqual('demo');
        expect(state.translateLocaleLabel).toEqual('Demo');
      });
      it('disable translation mode', () => {
        const action = disableTranslationMode();
        state = reducer(state, action);
        expect(state.isTranslateModeEnabled).toBe(false);
        expect(state.translateLocale).toBeFalsy();
      });
      it('close language select panel', () => {
        state = reducer(state, openTranslateLanguageSelect());
        const action = closeTranslateLanguageSelect();
        state = reducer(state, action);
        expect(state.isTranslateLanguageSelectOpened).toBe(false);
      });
    });
  });
});
