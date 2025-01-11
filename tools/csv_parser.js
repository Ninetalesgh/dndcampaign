function convertFeetInt(feetValueInt)
{
  let squares = (feetValueInt / 5);
  let meters = squares * 1.5;

  return `${squares} *(${meters}m)*`;
}

function convertStringToCustomFormat(string)
{
  //custom
  let strippedString = string.replace(/\ssaving\sthrow/gm, ' Save');
  strippedString = strippedString.replace(/\sstrength/gmi, ' STR');
  strippedString = strippedString.replace(/\sdexterity/gmi, ' DEX');
  strippedString = strippedString.replace(/\sconstitution/gmi, ' CON');
  strippedString = strippedString.replace(/\sintelligence/gmi, ' INT');
  strippedString = strippedString.replace(/\swisdom/gmi, ' WIS');
  strippedString = strippedString.replace(/\scharism/gmi, ' CHA');
  strippedString = strippedString.replace(/([0-9]+)\/([0-9]+0)\sft./gm, (m, g1, g2) => (convertFeetRangeInts(g1, g2)));
  strippedString = strippedString.replace(/([0-9]+)\sfeet/gm, (m, g) => (convertFeetInt(g)));
  strippedString = strippedString.replace(/(?:a|an)?\s([0-9]+)-foot(?:\s|-)(cube|square)/gmi, (m, g1, g2) => `a size ${convertFeetInt(g1)} ${g2.toLowerCase()}`);
  strippedString = strippedString.replace(/(?:a|an)?\s([0-9]+)-foot(?:\s|-)?(?:radius)?(?:\s|-)(sphere|circle|emanation|radius)/gmi, (m, g1, g2) => g2.toLowerCase() === 'radius' ? `a radius ${convertFeetInt(g1)} sphere` : `a radius ${convertFeetInt(g1)} ${g2.toLowerCase()}`);
  strippedString = strippedString.replace(/(?:a|an)?\s([0-9]+)-foot(?:\s|-)(line|cone)/gmi, (m, g1, g2) => `a length ${convertFeetInt(g1)} ${g2.toLowerCase()}`);
  strippedString = strippedString.replace(/([0-9]+) ft./gm, (m, g) => (convertFeetInt(g)));
  return strippedString;
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
function convertCsvPartsToSpell(lineParts, columns)
{
  let output = new Array();

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
    const descriptionString = convertStringToCustomFormat(lineParts[columns[7]].replace(/have\sthe\s(Paralyzed|Charmed|Restrained|Frightened|Prone|Stunned)\scondition/gmi, (m, g) => `be [${g}](conditions.md#${g.toLowerCase().replace(' ', '-')})`));
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

  return `${output.join('\n')}\n`;
}


function convertCsvToHtml(csvString)
{
  let mdText = new Array();

  let lines = csvString.split('\n');

  let columns = new Array(10);
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
  }

  console.log(columns);

  for (let i = 1; i < lines.length; ++i)
  {
    let elements = lines[i].slice(1, -1).split('","');
    mdText.push(convertCsvPartsToSpell(elements, columns));
  }

  let result = mdText.join('\n');
  navigator.clipboard.writeText(result).then(() => {
    console.log("copied md to clipboard!");
  });
  return parseMd(result);
}