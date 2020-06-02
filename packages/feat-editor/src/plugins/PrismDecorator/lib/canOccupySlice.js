// Lift from draft-js, src/model/decorators/CompositeDraftDecorator.js
/**
 * Determine whether we can occupy the specified slice of the decorations
 * array.
 */
function canOccupySlice(
  decorations: Array<?string>,
  start: number,
  end: number,
): boolean {
  for (let ii = start; ii < end; ii++) {
    if (decorations[ii] != null) {
      return false;
    }
  }
  return true;
}

export default canOccupySlice;
