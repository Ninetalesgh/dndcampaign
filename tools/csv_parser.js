function convertFeetInt(feetValueInt)
{
  let squares = (feetValueInt / 5);
  let meters = squares * 1.5;

  return `${squares} *(${meters}m)*`;
}

function convertStringToCustomFormat(string)
{
  let strippedString = string.replace(/\ssaving\sthrow/gm, ' Save');
  strippedString = strippedString.replace(/\sstrength/gmi, ' STR');
  strippedString = strippedString.replace(/\sdexterity/gmi, ' DEX');
  strippedString = strippedString.replace(/\sconstitution/gmi, ' CON');
  strippedString = strippedString.replace(/\sintelligence/gmi, ' INT');
  strippedString = strippedString.replace(/\swisdom/gmi, ' WIS');
  strippedString = strippedString.replace(/\scharism/gmi, ' CHA');
  strippedString = strippedString.replace(/([0-9]+)\/([0-9]+0)\sft./gm, (m, g1, g2) => (convertFeetRangeInts(g1, g2)));
  strippedString = strippedString.replace(/(?:a|an)?\s([0-9]+)-foot(?:\s|-)(cube|square)/gmi, (m, g1, g2) => `a size ${convertFeetInt(g1)} ${g2.toLowerCase()}`);
  strippedString = strippedString.replace(/(?:a|an)?\s([0-9]+)-foot(?:\s|-)?(?:radius)?(?:\s|-)(sphere|circle|emanation|radius|diameter)/gmi, (m, g1, g2) => {
    if (g2.toLowerCase() === 'radius') { return `a radius ${convertFeetInt(g1)} sphere` }
    else if (g2.toLowerCase() === 'diameter') { return `a diameter ${convertFeetInt(g1)}` }
    else { return `a radius ${convertFeetInt(g1)} ${g2.toLowerCase()}`}});
  strippedString = strippedString.replace(/(?:a|an)?\s([0-9]+)-foot(?:\s|-)(line|cone)/gmi, (m, g1, g2) => `a length ${convertFeetInt(g1)} ${g2.toLowerCase()}`);
  strippedString = strippedString.replace(/([0-9]+)(?:-|\s)foot(?:\s|-)(high|tall|long|wide)/gmi, (m, g1, g2) => {
    if (g2.toLowerCase() === 'long'){ `length ${convertFeetInt(g1)}`}
    else if (g2.toLowerCase() === 'wide'){ `width ${convertFeetInt(g1)}`}
    else { return `height ${convertFeetInt(g1)}`; }});
  strippedString = strippedString.replace(/1\s(?:ft.|foot)/gm, (m) => '30cm');
  strippedString = strippedString.replace(/([0-9]+)\s(?:ft.|feet)/gm, (m, g) => (convertFeetInt(g)));
  return strippedString;
}

function addTags(string)
{
  const conditionsGroup = '(Bleeding|Blinded|Burning|Charmed|Choking|Deafened|Frightened|Grappled|Incapacitated|Invisible|Paralyzed|Petrified|Poisoned|Prone|Restrained|Stunned|Unconscious)'; 
  let regex = new RegExp(`have\\sthe\\s${conditionsGroup}\\scondition`, 'gmi');
  let taggedString = string.replace(regex, (m, g) => `be [${g}](conditions.md#${g.toLowerCase().replace(' ', '-')})`);
  regex = new RegExp(`has\\sthe\\s${conditionsGroup}\\scondition`, 'gmi');
  taggedString = taggedString.replace(regex, (m, g) => `is [${g}](conditions.md#${g.toLowerCase().replace(' ', '-')})`);
  regex = new RegExp(`has\\sthe\\s${conditionsGroup}\\sor\\s${conditionsGroup}\\scondition`, 'gmi');
  taggedString = taggedString.replace(regex, (m, g1, g2) => `is [${g1}](conditions.md#${g1.toLowerCase().replace(' ', '-')}) or [${g2}](conditions.md#${g2.toLowerCase().replace(' ', '-')})`);
  regex = new RegExp(`\\s${conditionsGroup}(\\s|,|\.)`, 'gmi');
  taggedString = taggedString.replace(regex, (m, g1, g2) => ` [${g1}](conditions.md#${g1.toLowerCase().replace(' ', '-')})${g2}`);
  return taggedString;
}

//Column indices expect to be in this order:
// Index 0: "Name"
// Index 1: "Level"
// Index 2: "School"
// Index 3: "Casting Time"
// Index 4: "Range"
// Index 5: "Components"
// Index 6: "Duration"
// Index 7: "Text"
// Index 8: "At Higher Levels"
// Index 9: "Classes"
// Index 10: "Source"
// Index 11: "Page"

function convertCsvPartsToSpell(lineParts, columns)
{
  let output = new Array();

  if (lineParts.length < 12)
  {
    return "";
  }

  // Name
  output.push(`### ${lineParts[columns[0]]}`);
  
  // Level & School
  {
    if (lineParts[columns[1]] === "Cantrip")
    {
      output.push(`*${lineParts[columns[2]]} ${lineParts[columns[1]]}*`);
    }
    else
    {
      output.push(`*Level ${parseInt(lineParts[columns[1]][0])} ${lineParts[columns[2]].replace(/^([^\s]+)/,'$1')}*`);
    }
  }

  // Casting Time
  {
    const ritualString = lineParts[columns[2]].match(/[^(]+\(([^)]+)\)/) ? ' or Ritual' : '';
    let timeString = lineParts[columns[3]];
    if (timeString === "Bonus")
    {
      timeString = "Bonus Action";
    }

    output.push(`- **Casting Time**: ${timeString}${ritualString}`);
  }

  // Range
  {
    const rangeString = convertStringToCustomFormat(lineParts[columns[4]].replace(/([^(]+)\s\(([^)]+)\)/i, '$1,  $2'));
    output.push(`- **Range**: ${rangeString}`);
  }

  // Components
  {
    const componentsString = lineParts[columns[5]].replace(/,\sM.*/,'');
    output.push(`- **Components**: ${componentsString}`);
  }

  // Duration
  {
    const durationString = lineParts[columns[6]].replace(/Concentration/, '[Concentration](conditions.md#concentration)');
    output.push(`- **Duration**: ${durationString}`);
  }

  // Text
  {
    const descriptionString = addTags(convertStringToCustomFormat(lineParts[columns[7]]));
    output.push(descriptionString);
  }

  // At Higher Levels
  {
    let upcastString = lineParts[columns[8]].trimStart().replace(/Using\sa\sHigher-Level\sSpell\sSlot\./, '**Using a Higher-Level Spell Slot.**');
    upcastString = upcastString.trimStart().replace(/Cantrip\sUpgrade\./, '**Cantrip Upgrade.**')
    upcastString = convertStringToCustomFormat(upcastString);
    output.push(upcastString);
  }

  // Classes
  {
    let classes = lineParts[columns[9]].split(', ');
    let uniqueClasses = new Array();
    classes.forEach(classEntry => {
      if (!uniqueClasses.some(item => item.toLowerCase() === classEntry.toLowerCase()))
      {
        uniqueClasses.push(classEntry);
      }
    });
    uniqueClasses.sort();
    const classesString = `- **Classes**: ${uniqueClasses.join(', ')}`;
    output.push(classesString);
  }

  // Source
  {
    const pageString = lineParts[columns[11]] === 'undefined' ? '' : `, page ${lineParts[columns[11]]}`;
    const sourceString = `*(Source: ${lineParts[columns[10]]}${pageString})*`;
    output.push(sourceString);
  }

  return `${output.join('\n')}\n`;
}


function convertCsvToSpellLinks(csvString)
{
  const lines = csvString.split('\n');
  let spellLevels = new Array(10);
  let levelColumn = 3;
  for (let i = 1; i < lines.length; ++i)
  {
      let elements = lines[i].slice(1, -1).split('","');
      if (elements.length < 3) { continue; }

      let level = elements[levelColumn] === 'Cantrip' ? 0 : parseInt(elements[levelColumn][0]);
      if (!spellLevels[level])
      {
        spellLevels[level] = new Array(); 
        spellLevels[level].push(level ? `## Level ${level}` : '## Cantrips'); 
      }

      spellLevels[level].push(`[${elements[0]}](spells.md#spells-${elements[0][0].toLowerCase()}#${elements[0].toLowerCase().replace(/\s/g, '-')})`);
  }
  let result = new Array();

  spellLevels.forEach(levelEntry => {
    if (levelEntry)
    {
      levelEntry.forEach(levelSpellEntry => {
        result.push(levelSpellEntry);
      });
    }
  });

  return result.join('\n');
}

function convertCsvToHtml(csvString)
{
  let mdText = new Array();

  const lines = csvString.split('\n');

  let columns = new Array(12);
  {
    let parts = lines[0].slice(1, -1).split('","');
    columns[0] = parts.indexOf('Name');
    columns[1] = parts.indexOf('Level');
    columns[2] = parts.indexOf('School');
    columns[3] = parts.indexOf('Casting Time');
    columns[4] = parts.indexOf('Range');
    columns[5] = parts.indexOf('Components');
    columns[6] = parts.indexOf('Duration');
    columns[7] = parts.indexOf('Text');
    columns[8] = parts.indexOf('At Higher Levels');
    columns[9] = parts.indexOf('Classes');
    columns[10] = parts.indexOf('Source');
    columns[11] = parts.indexOf('Page');
  }
  if (columns[0] === -1 && columns[1] === -1)
  {
    mdText.push(convertCsvToSpellLinks(csvString));
  }
  else
  {
    let currentLetter = '';
    for (let i = 1; i < lines.length; ++i)
    {
      let elements = lines[i].slice(1, -1).split('","');
      if (elements[0][0] > currentLetter)
        {
          currentLetter = elements[0][0];
          mdText.push(`# Spells ${currentLetter}`)
        }
        mdText.push(convertCsvPartsToSpell(elements, columns));
      }    
  }
      
  let result = mdText.join('\n');
  navigator.clipboard.writeText(result).then(() => {
    console.log("copied md to clipboard!");
  });
  return parseMd(result);
}