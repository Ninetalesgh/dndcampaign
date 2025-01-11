function convertFeetInt(feetValueInt)
{
  let squares = (feetValueInt / 5);
  let meters = squares * 1.5;

  return `${squares} *(${meters}m)*`;
}

function convertFeetString(feetInString)
{
  return feetInString.replace(/([0-9]+) ft./gm, (m, g) => (convertFeetInt(g)));
}

function convertFeetRangeInts(nearRange,farRange)
{
  let squaresNear = (nearRange / 5);
  let metersNear = squaresNear * 1.5;
  let squaresFar = (farRange / 5);
  let metersFar = squaresFar * 1.5;
  
  return `${squaresNear}/${squaresFar} *(${metersNear}m/${metersFar}m)*`;
}

