import {
  FeedRenderEngine,
  getRandomItem,
} from '@/components/FeedRender/helpers';
import * as rowTemplates from '@/components/FeedRender/Row';

export const provider = new FeedRenderEngine();

// 0 -- 7
function internalGetTemplates(count, rows) {
  if (count === 0) {
    return [];
  }
  if (count === 1) {
    return getRandomItem([[rows.RowI], [rows.RowII], [rows.RowIII]]);
  }
  if (count === 2) {
    return getRandomItem([
      [rows.RowIV],
      [rows.RowV],
      [rows.RowVI],
      [rows.RowVII],
    ]);
  }
  if (count === 3) {
    return getRandomItem([[rows.RowVIII], [rows.RowIX]]);
  }
  if (count === 4) {
    return [
      getRandomItem([rows.RowI, rows.RowII, rows.RowIII]),
      getRandomItem([rows.RowX, rows.RowXI]),
    ];
  }
  if (count === 5) {
    // 1 + 4
    return [
      getRandomItem([rows.RowI, rows.RowII, rows.RowIII]),
      getRandomItem([rows.RowXII, rows.RowXIII]),
    ];
  }
  if (count === 6) {
    // 1 + 2 + 3
    return [
      getRandomItem([rows.RowI, rows.RowII, rows.RowIII]),
      getRandomItem([rows.RowIV, rows.RowV, rows.RowVI, rows.RowVII]),
      getRandomItem([rows.RowX, rows.RowXI]),
    ];
  }

  if (count === 7) {
    return getRandomItem([
      [rows.RowI, rows.RowIV, rows.RowIV, rows.RowIV],
      [rows.RowVIII, rows.RowIV, rows.RowIV],
      [rows.RowIX, rows.RowII, rows.RowX],
      [rows.RowI, rows.RowVI, rows.RowXIII],
      [rows.RowI, rows.RowVII, rows.RowXII],
      [rows.RowII, rows.RowX, rows.RowX],
      [rows.RowI, rows.RowXI, rows.RowXI],
      [rows.RowI, rows.RowX, rows.RowX],
      [rows.RowIII, rows.RowXI, rows.RowXI],
      [rows.RowI, rows.RowVII, rows.RowV, rows.RowV],
      [rows.RowI, rows.RowX, rows.RowXI],
      [rows.RowI, rows.RowXI, rows.RowXI],
    ]);
  }
  return [];
}
provider.getTemplates = function getTemplates(count) {
  const { rows } = this;
  const result = internalGetTemplates(count, rows);
  return result.map((item) => item.toString());
};

Object.values(rowTemplates).forEach((T) => {
  provider.register(T);
});
// provider.setFirstRowOptions([
//   rowTemplates.RowI,
//   rowTemplates.RowII,
//   rowTemplates.RowIII,
//   rowTemplates.RowVIII,
//   rowTemplates.RowIX,
// ]);

// [1, 2, 3, 4, 5, 6, 7].forEach((count) => {
//   console.log(count, provider.getTemplates(count));
// });
