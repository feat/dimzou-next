import { provider } from '../helpers';
import * as templates from '../Row';
import * as cards from '../Card';

describe('Cards', () => {
  it('card has code attribute', () => {
    Object.values(cards).forEach((T) => {
      expect(T.code).toBeTruthy();
    });
  });
});

describe('Templates', () => {
  it('template has count attribute', () => {
    Object.values(templates).forEach((T) => {
      expect(T.count).toBeTruthy();
    });
  });
  it('template has toString attribute', () => {
    Object.values(templates).forEach((T) => {
      expect(T.toString()).toBeTruthy();
    });
  });
});

describe('Get feed templates', () => {
  it('get template for 1 item', () => {
    const output = provider.getTemplates(1);
    expect(output.length).toBe(1);
    expect(provider.getTemplate(output[0]).count).toBe(1);
  });
  it('get template for 2 items', () => {
    const output = provider.getTemplates(2);
    expect(output.length).toBe(1);
    expect(provider.getTemplate(output[0]).count).toBe(2);
  });
  it('get template for 3 items', () => {
    const output = provider.getTemplates(3);
    expect(output.length).toBe(1);
    expect(provider.getTemplate(output[0]).count).toBe(3);
  });
  it('get template for 4 items', () => {
    const output = provider.getTemplates(4);
    // console.log(output);
    expect(output.length).toBeTruthy();
  });
  it('get templates for 10 items', () => {
    const output = provider.getTemplates(10);
    const sum = output.reduce((a, b) => a + provider.getTemplate(b).count, 0);
    expect(sum).toBe(10);
  });
});
