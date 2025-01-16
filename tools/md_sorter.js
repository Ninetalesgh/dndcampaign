function getIndexForChar(char){ return char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0); }
function getCharForIndex(index) { return String.fromCharCode('a'.charCodeAt(0) + index); }

function recordEntry(lines, startIndex, endIndex)
{
  const char = lines[startIndex].trimStart().slice(4);
  console.log(char);
  const index = getIndexForChar(char);
  console.log(index);

  return lines.slice(startIndex, endIndex).join('\n');
}

function sortMdContentPageHeaders(mdText)
{
  const lines = mdText.split('\n');

  let sorted = new Array(26);
  for (let i = 0; i < 26; ++i)
  {
    sorted[i] = new Array();
  }

  let currentBlockStartIndex = -1;
  let doneSorting = false;
  let contentType = 'Items';

  let lastIndex = 0;
  for (let i = 0; i < lines.length; ++i)
  {
    if (lines[i].trimStart().startsWith('#'))
    {

      if (doneSorting)
      {
        lastIndex = i;
        console.log('huh ' + lastIndex);
        break; // done sorting
      }

      else if (currentBlockStartIndex >= 0)
      {
        const char = lines[currentBlockStartIndex].trimStart().slice(4);
        const index = getIndexForChar(char);
        const entry = lines.slice(currentBlockStartIndex, i).join('\n');
        sorted[index].push(entry);
        currentBlockStartIndex = -1;
      }
    }
    
    if (lines[i].trimStart().startsWith('### '))
      {
        currentBlockStartIndex = i;
    }

    if (lines[i].trimStart().startsWith(`## ${contentType} Z`))
    {
      console.log('hah');
      //Stop sorting after next header change
      doneSorting = true;
    }
  }

  if (!doneSorting && currentBlockStartIndex >= 0)
  {
    lastIndex = lines.length;
    console.log(currentBlockStartIndex, lastIndex);
    console.log(lines.slice(currentBlockStartIndex, lastIndex));
    const char = lines[currentBlockStartIndex].trimStart().slice(4);
    const index = getIndexForChar(char);
    const entry = lines.slice(currentBlockStartIndex, lastIndex + 1).join('\n');
    sorted[index].push(entry);
  }

  console.log(sorted);

  for (let i = 0; i < 26; ++i)
  {
    sorted[i] = `## ${contentType} ${getCharForIndex(i).toUpperCase()}\n${sorted[i].join('\n')}`;
  }

  const result = `${sorted.join('\n')}\n${lines.slice(lastIndex).join('\n')}`;
  navigator.clipboard.writeText(result).then(() => {
    console.log("copied md to clipboard!");
  });

  return result;
}