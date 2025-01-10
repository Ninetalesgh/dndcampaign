
    function reformatHeader(line)
    {
      let resultH = "";
      if (line.startsWith("# ")) {resultH = "h1"; line = line.substring(2);}
      else if (line.startsWith("## ")) {resultH = "h2"; line = line.substring(3);}
      else if (line.startsWith("### ")) {resultH = "h3"; line = line.substring(4);}
      else if (line.startsWith("#### ")) {resultH = "h4"; line = line.substring(5);}
      else if (line.startsWith("##### ")) {resultH = "h5"; line = line.substring(6);}
      else if (line.startsWith("##### ")) {resultH = "h6"; line = line.substring(7);}
      else
      {
        //it's a token, just leave it.
        return line;
      }

      return `<${resultH} id="${line.replace(/\s/g, '_')}">${line}</${resultH}>`;
    }

    function parseMd(input)
    {
      const lines = input.split('\n');
    
      for (let i = 0; i < lines.length; ++i)
      {
        //Annoying things
        if(lines[i].trim() === "")
        {
          continue;
        }
        else if (lines[i].startsWith("#"))
        {
          lines[i] = reformatHeader(lines[i]);
          continue;
        }
        else if(lines[i].trimStart().startsWith(">[!INFO]"))
        {
          //TODO maybe get obsidian specifics into this
        }

        //images 
        lines[i] = lines[i].replace(/!\[([^\|]+)\|([^\]]+)\]\(([^)]+)\)/g, '<img src="$3" style="width:$2px;">');

        //bold
        lines[i] = lines[i].replace(/\*\*([^ ][^*]*[^ ])\*\*/g, "<b>$1</b>");
        
        //italic
        lines[i] = lines[i].replace(/\*([^ ][^*]*[^ ])\*/g, "<i>$1</i>");
  
        let indent = 0;
        let counter = 0;
        while(counter < lines[i].length && lines[i][counter++] === " ")
        {
          indent += 10;
        }

        //paragraph
        lines[i] = '<p style="margin-left:'+ indent.toString() + 'px;">' + lines[i] + '</p>';
      }

      //Tables
      for (let i = 0; i < lines.length; ++i)
      {
        let tableMatches = lines[i].match(/[ ]?(:?--:?)[ ]?\|?/g);
        
        if (i > 0 && tableMatches && tableMatches.length > 1)
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

    async function fetchMdAsHtml(relativeMdPath)
    {
      let mdUrl = "https://ninetalesgh.github.io/dndcampaign/" + relativeMdPath;
      try 
      {
        const response = await fetch(mdUrl);

        if (!response.ok)
        {
          throw new Error('network error');
        }

        const data = await response.text();
        return parseMd(data);
      }
      catch (error)
      {
        console.error('fetch error', error);
      }
    }

    