import { extractWidgetInfo } from '../utils/rewordings';
import { REWORDING_WIDGET_IMAGE } from '../constants';

describe('Dimzou Rewording Utils', () => {
  describe('extractWigetInfo', () => {
    it('standard rewording data', () => {});
    it('fallback html_content with image info, 01', () => {
      const record = {
        id: 269108,
        type: 200,
        content: '',
        html_content:
          '<figure><img src="/media/9216166714488/dimzou/reword/200/20190612_FCA0548_000022.jpg"/></figure>',
        img: null,
        crop_img: null,
        status: 100,
        version: 1,
        last_modified: '2019-07-12T01:48:08.818198Z',
        create_time: '2019-07-12T01:48:08.817435Z',
        is_selected: true,
        content_meta: {
          blocks: [
            {
              key: '5kdrl',
              data: {},
              text: ' ',
              type: 'atomic',
              depth: 0,
              entityRanges: [{ key: 0, length: 1, offset: 0 }],
              inlineStyleRanges: [],
            },
          ],
          entityMap: {
            '0': {
              data: {
                src:
                  '/media/9216166714488/dimzou/reword/200/20190612_FCA0548_000022.jpg',
              },
              type: 'IMAGE',
              mutability: 'MUTABLE',
            },
          },
        },
        base_on: null,
        comments_count: 0,
        likes_count: 0,
        template_config: null,
      };
      const info = extractWidgetInfo(record);
      expect(info.type).toBe(REWORDING_WIDGET_IMAGE);
      expect(info.src).toBe(
        '/media/9216166714488/dimzou/reword/200/20190612_FCA0548_000022.jpg',
      );
    });

    it('fallback html_content with image info, 02', () => {
      const record = {
        html_content:
          '<figure><img src="/media/9216166714488/dimzou/reword/200/20190612_603E9AE_000023.jpg"></figure>',
      };
      const info = extractWidgetInfo(record);
      expect(info.type).toBe(REWORDING_WIDGET_IMAGE);
      expect(info.src).toBe(
        '/media/9216166714488/dimzou/reword/200/20190612_603E9AE_000023.jpg',
      );
    });
  });
});
