// Lift from draft-js, src/model/decorators/CompositeDraftDecorator.js
/**
 * Splice the specified component into our decoration array at the desired
 * range.
 */
function occupySlice(
  targetArr: Array<?string>,
  start: number,
  end: number,
  componentKey: string
): void {
  for (var ii = start; ii < end; ii++) {
    targetArr[ii] = componentKey;
  }
}

export default occupySlice;
