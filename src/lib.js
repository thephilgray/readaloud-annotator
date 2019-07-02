export const createTextMap = text =>
  text
    .split('\n')
    .map(line => line.split(' '))
    .reduce((acc, curr) => {
      if (typeof curr === 'object') {
        return [...acc, ...curr, '\n'];
      }
      return [...acc, curr];
    }, [])
    .map(val => ({ val }));

export const roundHalf = n =>
  Number((Math.round(Number(n) * 10) / 10).toFixed(1));

export const toHtml = data => {
  let firstPlayhead = true;
  return data.reduce((acc, curr, i) => {
    /* if the first item doesn't have a data-playhead, set it to 0 */
    if (i === 0 && curr.playhead === undefined) {
      return `<span data-playhead="0">${acc}${curr.val} `;
    } else if (curr.playhead !== undefined && firstPlayhead) {
      firstPlayhead = false;
      return `${acc}<span data-playhead="${curr.playhead}">${curr.val} `;
    } else if (curr.playhead !== undefined) {
      return `${acc}</span><span data-playhead="${curr.playhead}">${curr.val} `;
    }
    // if last item give it a wrapping span tag
    else if (data.length - 1 === i) {
      return `${acc}${curr.val}</span>`;
    } else if (curr.val === '\n') {
      return `${acc}<br/>`;
    }
    return `${acc}${curr.val} `;
  }, '');
};
