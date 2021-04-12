import { BEGINNING_PIVOT, TAILING_PIVOT } from '../constants';
import {
  getConfirmedHTML,
  getBaseHTML,
  combineBlockList,
  isInternalBlock,
} from '../utils/content';

describe('Content Utils', () => {
  it('confirmedHTML', () => {
    const HTML =
      '<p><span data-entity-type="annotation:add"><strong>abc</strong></span>Info</p>';
    const confirmed = getConfirmedHTML(HTML);
    expect(confirmed).toEqual('<p><strong>abc</strong>Info</p>');
  });
  it('baseHTML', () => {
    const HTML =
      '<p><span data-entity-type="annotation:add"><strong>abc</strong></span>Info</p>';
    const base = getBaseHTML(HTML);
    expect(base).toEqual('<p>Info</p>');
  });

  describe('combineBlockList', () => {
    it('appending order', () => {
      const list = new Array(10);
      list[8] = 12;
      list[4] = 8;
      const appendings = {
        12: {},
        8: {},
      };
      const capabilities = { canAppendContent: true };
      const output = combineBlockList(list, appendings, capabilities);
      expect(output[0]).toEqual(BEGINNING_PIVOT);
      expect(output.length).toEqual(13);
      expect(output[6]).toBe('a.8'); // 1 + 4 + 1
      expect(output[11]).toBe('a.12'); // 1 + 1 + 8 + 1
    });
    it('canAppendContent === true, auto append tailing block', () => {
      const list = new Array(10);
      const appendings = {};
      const capabilities = { canAppendContent: true };
      const output = combineBlockList(list, appendings, capabilities);
      expect(output[0]).toEqual(BEGINNING_PIVOT);
      expect(output.length).toEqual(12);
      expect(output[11]).toBe(`a.${TAILING_PIVOT}`); // last append
    });
    it('canAppendContent === false, do not append tailing block', () => {
      const list = new Array(10);
      list[8] = 12;
      const appendings = {};
      const capabilities = { canAppendContent: false };
      const output = combineBlockList(list, appendings, capabilities);
      expect(output[0]).toEqual(BEGINNING_PIVOT);
      expect(output.length).toEqual(11); // 1 + 10
    });
    it('no duplicate keys inserted', () => {
      const list = [1, 2, 3, 4];
      const appendings = { [-1]: {} };
      const output = combineBlockList(list, appendings, {
        canAppendContent: false,
      });
      expect(Array.from(new Set(output)).length).toEqual(output.length);
    });
  });

  describe('isInternalBlock', () => {
    it('BEGINNING_PIVOT is internal block', () => {
      const result = isInternalBlock(BEGINNING_PIVOT);
      expect(result).toBe(true);
    });
    it('TAILING_PIVOT is internal block', () => {
      const result = isInternalBlock(TAILING_PIVOT);
      expect(result).toBe(true);
    });
    it('blockKey with a. prefix is internal block', () => {
      const result = isInternalBlock('a.123123');
      expect(result).toBe(true);
    });
    it('other keys should not be an internal block', () => {
      expect(isInternalBlock('123123123')).toBe(false);
      expect(isInternalBlock('123-1231-12')).toBe(false);
      expect(isInternalBlock('ab3.08d')).toBe(false);
    });
  });
});
