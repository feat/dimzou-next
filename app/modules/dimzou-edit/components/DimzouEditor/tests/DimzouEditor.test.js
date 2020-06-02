import { clearHTML } from '../index';

describe('DimzouEditor', () => {
  describe('clearHTML', () => {
    it('remove image tag', () => {
      const html =
        '<div>Demo</div><div><img src="http://exmaple.com/image.png" /></div>';
      const output = clearHTML(html);
      expect(output).toEqual('<div>Demo</div>');
    });
    it('remove anchor tags', () => {
      const html = '<p>This is <a href="">link</a></p><div>Custom</div>';
      const output = clearHTML(html);
      expect(output).toEqual(
        '<p>This is <span>link</span></p><div>Custom</div>',
      );
    });
    it('h4 --> strong', () => {
      const html = '<h4>Demo</h4>';
      const output = clearHTML(html);
      expect(output).toEqual('<strong>Demo</strong>');
    });
  });
});
