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
  let contentType = '';

  let lastIndex = 0;
  for (let i = 0; i < lines.length; ++i)
  {
    if (lines[i].trimStart().startsWith('#'))
    {
      if (contentType === '')
      {
        const contentTypeMatch = lines[i].match(/^##\s(.*)\s[A-Z]$/mi);
        if (contentTypeMatch) 
        {
          contentType = contentTypeMatch[1];
          console.log(`Sorting '${contentType}' content.`);
        }
      }

      if (currentBlockStartIndex >= 0)
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

    if (contentType !== '' && lines[i].trimStart().startsWith(`## ${contentType} End`))
    {
      lastIndex = i;
      break;
    }
  }
  
  for (let i = 0; i < 26; ++i)
  {
    sorted[i].sort();
    if (contentType === '')
    {
      sorted[i] = sorted[i].join('\n');     
    }
    else
    {
      sorted[i] = `## ${contentType} ${getCharForIndex(i).toUpperCase()}\n${sorted[i].join('\n')}`;     
    }
  }

  const result = `${sorted.join('\n')}\n${lines.slice(lastIndex).join('\n')}`;
  navigator.clipboard.writeText(result).then(() => {
    console.log("copied md to clipboard!");
  });

  return result;
}