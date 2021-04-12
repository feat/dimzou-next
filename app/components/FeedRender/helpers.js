import invariant from 'invariant';
import * as rowTemplates from './Row';

export function getRandomItem(items) {
  const arr = Array.from(items);
  return arr[Math.floor(Math.random() * arr.length)];
}

export class FeedRenderEngine {
  // feed row
  rows = {};

  // group by row count { [count]: Set }
  rowGroups = {};

  firstRowOptions = undefined;

  register(T) {
    invariant(T.count, 'Template should define count attribute');
    if (!this.rowGroups[T.count]) {
      this.rowGroups[T.count] = new Set();
    }
    this.rowGroups[T.count].add(T);
    this.rows[T] = T;
  }

  setFirstRowOptions(options) {
    this.firstRowOptions = options;
  }

  getTemplate(T) {
    return this.rows[T];
  }

  getTemplateForCount(count, escapeFirstRowOptions = false) {
    let options;
    if (this.rowGroups[count]) {
      options = Array.from(this.rowGroups[count]);
    } else {
      options = Object.values(this.rows);
    }
    // 仅在有可选项的时候过滤掉“第一行”的模版
    if (escapeFirstRowOptions && this.firstRowOptions) {
      const filtered = options.filter(
        (a) => this.firstRowOptions.indexOf(a) === -1,
      );
      options = filtered.length ? filtered : options;
    }
    return getRandomItem(options);
  }

  getTemplates(count, base = []) {
    if (count === 0) {
      return base;
    }
    if (count > 0 && count < 4 && this.rowGroups[count]) {
      return [...base, this.getTemplateForCount(count, true).toString()];
    }

    // 如果是初始区块，则使用第一行的选项
    if (base.length === 0 && this.firstRowOptions) {
      const t = getRandomItem(this.firstRowOptions);
      return this.getTemplates(count - t.count, [...base, t.toString()]);
    }

    let countOptions;
    let escapeFirstRowOptions = false;
    if (count >= 7) {
      // 长列表展示时，允许随机出现 firstRowOptions 中的模版
      countOptions = Object.keys(this.rowGroups);
    } else if (count === 4) {
      // 避免  1 + 3
      countOptions = [2, 4];
      escapeFirstRowOptions = true;
    } else {
      // 数量较少时，使用 小卡片组合
      countOptions = [2, 3, 4];
      escapeFirstRowOptions = true;
    }
    countOptions = countOptions.filter((a) => !!this.rowGroups[a]);

    let nextCount;

    let template;
    do {
      nextCount = getRandomItem(countOptions);
      template = this.getTemplateForCount(nextCount, escapeFirstRowOptions);
    } while (!template);

    return this.getTemplates(count - nextCount, [...base, template.toString()]);
  }
}

export const provider = new FeedRenderEngine();
Object.values(rowTemplates).forEach((T) => {
  provider.register(T);
});
provider.setFirstRowOptions([
  rowTemplates.RowI,
  rowTemplates.RowII,
  rowTemplates.RowIII,
  rowTemplates.RowVIII,
  rowTemplates.RowIX,
]);
