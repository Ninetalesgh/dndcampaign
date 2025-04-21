
function filterSectionSpecialCharacters(section)
{
  return section.replace(/\s/gm, '-').replace(/[^#a-zA-Z0-9-]/g, '').toLowerCase();
}

function reformatLink(name, link)
{
  let match = link.match(/^(?:\.\.\/|\.\/)*(.*\.md#)(.*)/);
  if (match)
  {
    link = `${match[1]}${filterSectionSpecialCharacters(match[2])}`;
    // TODO relative links won't work yet, they all assume /database as origin path
    // (dm/path is redirected to the absolute https for the dm branch)
    return `<button class="inline-link" onclick="toggleInlineLinkContent(this)" data-url="${link}">${name}</button>`;
  }
  else if (link.startsWith('https://'))
  {
    return `<a class="external-link" href="${link}">${name}</a>`;
  }
}

function formatCustomTracker(name, type, scale, value)
{
  



  console.log(name); // name, ID
  console.log(type); // point height, scale
  console.log(scale); // type
  console.log(value); // default or max value

  return '';
}

function parseMd(input)
{
  const lines = input.split('\n');
  
  // First pass, paragraphing and adding placeholders for inline content
  for (let i = 0; i < lines.length; ++i)
  {
    //Annoying things
    if(lines[i].trim() === "")
    {
      continue;
    }
    else if (lines[i].trim().startsWith('//'))
    {
      lines[i] = '';
      continue;
    }
    else if (lines[i].startsWith("#"))
    {    
      let currentHeaderDepth = 0; 
      // Count hashtags
      while (lines[i].slice(currentHeaderDepth).startsWith('#')){ ++currentHeaderDepth; }
      // Check for space after hashtags
      if (lines[i].slice(currentHeaderDepth).startsWith(' '))
      {
        const resultHeaderType = `h${currentHeaderDepth}`;
        const headerName = lines[i].substring(currentHeaderDepth + 1);
        // TODO if nested divs for headers is ever wanted?
        // This entails a redo of indexing the document, 
        // since that currently relies on a flat h-div-h-div... layout
        //
        //let divUnwrap = '';
        //while(headerDepth.length)
        //{
        //  const lastHeaderDepth = headerDepth[headerDepth.length - 1];
        //  if (currentHeaderDepth < lastHeaderDepth)
        //  {
        //    headerDepth.pop();
        //    divUnwrap = `${divUnwrap}</div>`;
        //    continue;
        //  }             
        //  else if (currentHeaderDepth > lastHeaderDepth)
        //  {
        //    headerDepth.push(currentHeaderDepth);
        //    break;
        //  }
        //  else
        //  {
        //    divUnwrap = `${divUnwrap}</div>`;
        //    break;
        //  }
        //}

        let divUnwrap = '</div>';
        lines[i] = `${divUnwrap}<${resultHeaderType} id="${filterSectionSpecialCharacters(headerName)}">${headerName}</${resultHeaderType}><div>`;
      }
      else
      {
        //TODO hashtag but no space = tag?
      }
      continue;
    }
    else if(lines[i].trimStart().startsWith(">[!INFO]"))
    {
      //TODO maybe get obsidian specifics into this or any custom formatting? 
    }

    //custom parsing
    lines[i] = lines[i].replace(/!\?\[([^\|\]]*)\|([0-9]*)\]\((?:track-cookie)#(text|discrete-counter|numeric-int|numeric-int-max)#?([0-9]+)?\)/g, (m,g1,g2,g3,g4) => formatCustomTracker(g1, g3, g2, g4 ?? ''));

    //images 
    lines[i] = lines[i].replace(/!\[(?:[^\|]+)\|([^\]]+)\]\(([^()]+(?:\([^()]*\)[^()]*)*)\)/g, (m,g1,g2) => `<img src="${g2}" style="width:${g1}px;" class="${g1 < 100 ? (g1 < 30 ? 'img-tiny-background' : 'img-small-background' ): 'img-normal-background'}">` );

    //bold
    lines[i] = lines[i].replace(/\*\*((?:[^\s].*?[^\s])|[^\s])\*\*/g, "<b>$1</b>");
    
    //italic
    lines[i] = lines[i].replace(/\*((?:[^\s].*?[^\s])|[^\s])\*/g, "<i>$1</i>");

    //links    
    lines[i] = lines[i].replace(/\[((?!]\().*?)\]\(([^)]+)\)/g, (m, g1, g2) => reformatLink(g1, g2));

    //paragraph
    let indent = 0;
    let counter = 0;
    while(counter < lines[i].length && lines[i][counter++] === " ")
    {
      indent += 10;
    }

    //Remove extra table identifiers early 
    lines[i] = lines[i].replace(/^\s*?\||\|\s*?$/g,'');

    lines[i] = '<p style="margin-left:'+ indent.toString() + 'px;">' + lines[i] + '</p><ul class="collapsed inline-link-placeholder"></ul>';
  }
  lines.push('</div>');

  //Second pass, Tables
  for (let i = 0; i < lines.length; ++i)
  {
    const tableMatches = lines[i].match(/[\s]?(:?--+:?)[\s]?\|?/g);
    const isTable = lines[i].match(/\|/);
    
    if (i > 0 && tableMatches && isTable && tableMatches.length > 1)
    {          
      let columns = new Array(tableMatches.length);
      for (let j = 0; j < tableMatches.length; ++j)
      {
        const leftalign = '<td style="text-align:left;"><p>';
        const centeralign = '<td style="text-align:center;"><p>';
        const rightalign = '<td style="text-align:right;"><p>';
        
        if (tableMatches[j].trimStart().startsWith(":")) 
        {
          if (tableMatches[j].trimStart().startsWith(":--:"))
          {
            columns[j] = centeralign;
          }
          else
          {
            columns[j] = leftalign;
          }
        }
        else 
        {
          columns[j] = rightalign;
        }     
      }

      for (let j = i-1; j < lines.length; ++j)
      {
        if (j == i)
        {
          lines[j] = ''; 
        }
        else
        {
          if (lines[j].trim() === "")
          {
            lines[j] = '</table>';
            break;
          }
          let k = 1;
          let newLineContent = '<tr>' + columns[0] + lines[j].replace(/\|/g, () => ( '</p></td>' + columns[k++]) || "|") + '</td></tr>';
          lines[j] = newLineContent;
        }
      }
      lines[i-1] = '<table>' + lines[i-1];
    }
  }

  return lines.join('');
}

async function fetchMdAsHtml(mdUrl)
{
  try 
  {
    const response = await fetch(mdUrl);

    if (!response.ok)
    {
      throw new Error(`error fetching: ${mdUrl}`);
    }

    const data = await response.text();
    return parseMd(data);
  }
  catch (error)
  {
    console.error('fetch error', error);
  }
}

