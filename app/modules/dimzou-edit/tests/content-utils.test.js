import {
  getConfirmedHTML, getBaseHTML,
} from '../utils/content'

describe('Content Utils', () => {
  it('confirmedHTML', () => {
    const HTML = '<p><span data-entity-type="annotation:add"><strong>abc</strong></span>Info</p>';
    const confirmed = getConfirmedHTML(HTML);
    expect(confirmed).toEqual('<p><strong>abc</strong>Info</p>');
  })
  it('baseHTML', () => {
    const HTML = '<p><span data-entity-type="annotation:add"><strong>abc</strong></span>Info</p>';
    const base = getBaseHTML(HTML);
    expect(base).toEqual('<p>Info</p>');
  })
});