const SCROLL_OFFSET = 130;

export function getActiveHash(outline, renderInfo) {
  if (!outline || !renderInfo) {
    return '';
  }
  if (renderInfo.startIndex === 0) {
    return '';
  }
  
  const equalPoint = outline.find((item) => item.sort === renderInfo.startIndex);
  if (equalPoint) {
    return `#content-${equalPoint.id}`;
  }
  
  const points = [
    { type: 'point', sort: 0},
    ...outline, 
    { type: 'point', sort: Number.POSITIVE_INFINITY}, 
    { type: 'start', sort: renderInfo.startIndex},
    { type: 'end', sort: renderInfo.stopIndex},
  ].sort((a, b) => a.sort - b.sort);
      
  const rangeStartIndex = points.findIndex((item) => item.type === 'start');
  const rangeStopIndex = points.findIndex((item) => item.type === 'end');
  const renderHeaders = points.slice(rangeStartIndex+1, rangeStopIndex)
  
  let activeHeader;
  // logging.debug('getActiveHash', points, rangeStartIndex, rangeStopIndex);

  for (let i = 0; i < renderHeaders.length; i+=1) {
    const point = renderHeaders[i];
    const headerBlock = document.querySelector(`[name='content-${point.id}']`);
    if (headerBlock) {
      const box = headerBlock.getBoundingClientRect();
      if (box.top < SCROLL_OFFSET) {
        activeHeader = point;
      } else {
        break;
      }
    }
  }
  // logging.debug('activeHeader', activeHeader);

  if (activeHeader) {
    return activeHeader ? `#content-${activeHeader.id}` : '';
  }
  
  const point = points[rangeStartIndex-1];
  // logging.debug('activeHeader point', point);
  return point && point.id ? `#content-${point.id}` : '';
}