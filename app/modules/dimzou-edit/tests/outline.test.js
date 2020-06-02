import {
  isHeading,
  getHeadingLevel,
} from '../utils/content'

const basic = '<h2>Demo</h2>';
const multiLine2 = `<h2>
<span>
  If this post resonated with you please check out these similar topics and sign up for my email list:
   </span>
</h2>`;
const multiLine = `<h2>
I am humbled more and more by the allies who are loyal readers of my work.
</h2> 
`;
describe('isHeading', () => {
  it('single line', () => {
    const blockIsHeading = isHeading(basic);
    expect(blockIsHeading).toBe(true);
  })
  it('multiline', () => {
    const blockIsHeading = isHeading(multiLine);
    expect(blockIsHeading).toBe(true);
    expect(isHeading(multiLine2)).toBe(true);
  })
  it('level2', () => {
    expect(getHeadingLevel(basic)).toEqual('2');
    expect(getHeadingLevel(multiLine)).toEqual('2');
    expect(getHeadingLevel(multiLine2)).toEqual('2');
  })
})