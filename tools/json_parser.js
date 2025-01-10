function convertFeetInt(feetValueInt)
{
  let squares = (feetValueInt / 5);
  let meters = squares * 1.5;

  return `${squares} *(${meters}m)*`;
}

function convertFeetString(feetInString)
{
  return feetInString.replace(/([0-9]+) ft./g, (m, g) => (convertFeetInt(g)));
}

function convertFeetRangeInts(nearRange,farRange)
{
  let squaresNear = (nearRange / 5);
  let metersNear = squaresNear * 1.5;
  let squaresFar = (farRange / 5);
  let metersFar = squaresFar * 1.5;
  
  return `${squaresNear}/${squaresFar} *(${metersNear}m/${metersFar}m)*`;
}

function strip5EToolsItemTag(string)
{
  return string.replace(/(?:\{@item )?([^|]+)(?:\|(?:[^}]*)\})?/g, (m, g) => (g));
}

function strip5EToolsTags(string)
{
  //specific
  let strippedString = string.replace(/\{@item\s([^}]+)\}|\{@damage\s([^}]+)\}/g, (m, g1, g2) => (g1 ? g1 : g2));
  strippedString = strippedString.replace(/\{@hit\s([0-9]+)\}/g, (m, g) => (`${parseInt(g) < 0 ? '-' : '+'}${parseInt(g).toString()}`));
  strippedString = strippedString.replace(/\{@h\}([0-9]+)/g, (m, g) => (`\n    *Hit*: ${parseInt(g).toString()}`));
  strippedString = strippedString.replace(/\{@dice\s([^}]+)\}/g, '$1');
  strippedString = strippedString.replace(/\{@dc\s([0-9]+)\}/g, 'DC $1');
  strippedString = strippedString.replace(/\{@atk\smw\}/g, '*Melee Attack*:');
  strippedString = strippedString.replace(/\{@atk\srw\}/g, '*Ranged Attack*:');
  strippedString = strippedString.replace(/\{@atk\smw,rw\}/g, '*Melee or Ranged Attack*:');
  strippedString = strippedString.replace(/\{@spell\s([^|}]+)[^}]*\}/g, '$1');
  strippedString = strippedString.replace(/\{@skill\s([^|}]+)[^}]*\}/g, '$1');
  strippedString = strippedString.replace(/\{@creature\s([^|}]+)[^}]*\}/g, '$1');
  strippedString = strippedString.replace(/\{@status\s([^|}]+)[^}]*\}/g, '$1');
  strippedString = strippedString.replace(/\{@condition\s([^|}]+)[^}]*\}/g, '$1');
  strippedString = strippedString.replace(/\{@recharge\s?([^}]*)\}/g, (m, g) => (g ? `(recharge ${g})` : '(recharge 6)'));

  //custom
  strippedString = strippedString.replace(/\ssaving\sthrow/g, ' Save');
  strippedString = strippedString.replace(/[sS]trength/g, 'STR');
  strippedString = strippedString.replace(/[dD]exterity/g, 'DEX');
  strippedString = strippedString.replace(/[cC]onstitution/g, 'CON');
  strippedString = strippedString.replace(/[iI]ntelligence/g, 'INT');
  strippedString = strippedString.replace(/[wW]isdom/g, 'WIS');
  strippedString = strippedString.replace(/[cC]harism/g, 'CHA');
  strippedString = strippedString.replace(/([0-9]+)\/([0-9]+0)\sft./g, (m, g1, g2) => (convertFeetRangeInts(g1, g2)));
  strippedString = strippedString.replace(/([0-9]+)\sfeet/g, (m, g) => (convertFeetInt(g)));
  strippedString = strippedString.replace(/(?:a|an)\s([0-9]+)-foot\s(cone|cube|square|sphere)/g, (m, g1, g2) => `a size ${convertFeetInt(g1)} ${g2}`);
  strippedString = strippedString.replace(/(?:a|an)\s([0-9]+)-foot\sline/g, (m, g1) => `a length ${convertFeetInt(g1)} line`);  
  strippedString = convertFeetString(strippedString);

  return strippedString;
}

function calculateAbilityMod(abilityScore)
{
  abilityScore = abilityScore % 2 === 0 ? abilityScore / 2 : (abilityScore - 1) / 2;
  let abilityModifier = abilityScore - 5;
  if (abilityModifier >= 0)
  {
    return `+${abilityModifier}`;
  }

  return abilityModifier.toString();
}

function parseSize(sizeString)
{
  if (sizeString === "T") { return "Tiny"; }
  else if (sizeString === "S") { return "Small"; }
  else if (sizeString === "M") { return "Medium"; }
  else if (sizeString === "L") { return "Large"; }
  else if (sizeString === "H") { return "Huge"; }
  else if (sizeString === "G") { return "Gargantuan"; }
  else { return sizeString; }
}

function parseAlignment(alignmentString)
{
  if (alignmentString === "L") { return "Lawful";}
  else if (alignmentString === "N") { return "Neutral";}
  else if (alignmentString === "C") { return "Chaotic";}
  else if (alignmentString === "G") { return "Good";}
  else if (alignmentString === "E") { return "Evil";}
  else if (alignmentString === "U") { return "Unaligned";}
  else if (alignmentString === "A") { return "Any Alignment";}
  else { return alignmentString;}
}

function convertMonsterSubSection(subsectionName, array)
{
  let result = new Array();

  result.push(`- **${subsectionName}**:`);
  if (array)
  {
    array.forEach(action => {
      let actionEntries = new Array();
      action.entries.forEach(actionEntry => {
        let stripped = strip5EToolsTags(actionEntry);
        actionEntries.push(stripped);
      });

      let resultString = `   - **${strip5EToolsTags(action.name)}**. ${actionEntries.join('\n   ')}`;
      result.push(resultString);
    });
  }

  return result;
}

function convert5EMonsterToText(jsonObject)
{
  let data = jsonObject;

  let output = new Array();
  output.push("### " + data.name);

  // CR
  {
    let crString = `**CR**: ${data.cr}`;
    output.push(crString);
  }

  // Size, Type, and Alignment 
  {
    let sizes = new Array();
    data.size.forEach(size => {
      sizes.push(parseSize(size));
    });
    
    let typeTagsString = '';
    let typeString = '';
    if (data.type.tags)
    {
      let typeTags = new Array();
      data.type.tags.forEach(type => {
        typeTags.push(type);
      });
      typeTagsString = ` (${typeTags.join(', ')})`;      
      typeString = data.type.type;
    }
    else
    {
      typeString = data.type;
    }
      
    let alignments = new Array();
    data.alignment.forEach(alignment => {
      alignments.push(parseAlignment(alignment));
    });

    let totalTypeString = `*${sizes.join(', ')} ${typeString}${typeTagsString}, ${alignments.join(' ')}*`;
    output.push(totalTypeString);
  }  
  
  // Initiative
  {
    output.push(`- **Initiative**: ${calculateAbilityMod(data.dex)}`)
  }

  // AC
  {
    let armorClasses = new Array();

    data.ac.forEach(ac => {      
      let listOfArmorSources = new Array();

      if (ac.from)
      {
        ac.from.forEach(armor => {
          listOfArmorSources.push(strip5EToolsItemTag(armor));
        });
      }
      
      let armorSourcesString = listOfArmorSources.length ? ` (${listOfArmorSources.join(', ')})` : '';
      let acString = `${ac.ac ? ac.ac.toString() : ac}${armorSourcesString}`;
      armorClasses.push(acString);      
    });

    let armorClassesString = '- **AC**: ' + armorClasses.join(', ');
    output.push(armorClassesString);
  }

  // HP
  { 
    let hpString = `- **HP**: ${data.hp.average.toString()} (${data.hp.formula})`;
    output.push(hpString);
  } 

  // Speed
  {
    let speeds = new Array();
    for (let key in data.speed)
    {
      speeds.push(`${key}: ${convertFeetInt(data.speed[key])}`);
    }

    let speedString = '- **Speed**: ' + speeds.join(', ');
    output.push(speedString);
  }

  // Ability Scores
  {
    output.push('');
    output.push('STR | DEX | CON | INT | WIS | CHA');
    output.push(' :--: | :--: | :--: | :--: | :--: | :--: '); 
    let scoreString = `${data.str} (${calculateAbilityMod(data.str)}) | ${data.dex} (${calculateAbilityMod(data.dex)}) | ${data.con} (${calculateAbilityMod(data.con)}) | ${data.int} (${calculateAbilityMod(data.int)}) | ${data.wis} (${calculateAbilityMod(data.wis)}) | ${data.cha} (${calculateAbilityMod(data.cha)}) `;
    output.push(scoreString);
    output.push('');
  }

  // Skills
  {
    let skills = new Array();
    for (let key in data.skill)
    {
      skills.push(`${key}: ${data.skill[key].toString()}`);
    }

    if (skills.length)
    {
      let skillsString = `- **Skills**: ${skills.join(', ')}`;
      output.push(skillsString);
    }
  }

  // Resistances
  {
    if (data.resist)
    {
      let resistances = new Array();
      let specialResistances = new Array();

      data.resist.forEach(resistance => {
        if (typeof resistance === "string")
          {
            resistances.push(resistance);
          }
          else
          {
            specialResistances.push(resistance);
          }
      });

      if (resistances.length)
      {
        resistances = [`${resistances.join(', ')};`];
      }

      specialResistances.forEach(sr => {
        let specialResistanceString = `${sr.preNote} ${sr.resist.join(', ')} ${sr.note}`;
        resistances.push(specialResistanceString);
      });

      if (resistances.length)
      {
        let resistancesString = `- **Resistances**: ${resistances.join(', ')}`;
        output.push(resistancesString.replace(/;,/g, ';'));
      }
    }
  }

  // Immunities
  {
    let immunities = new Array();
    if (data.immune)
    {
      data.immune.forEach(immunity => {
        if (typeof immunity === "string")
          {
            immunities.push(immunity);
          }
          else
          {
            console.log("TODO immunity notes.");
          }
      });

      console.log(immunities);
      if (immunities.length)
      {
        immunities = [`${immunities.join(', ')};`];
      }
      console.log(immunities);
    }

    if (data.conditionImmune)
    {
      data.conditionImmune.forEach(immunity => {
        if (typeof immunity === "string")
        {
          immunities.push(immunity);
        }
        else
        {
          console.log("TODO condition immunity notes.");
        }
      });
    }

    if (immunities.length)
    {
      let immunitiesString = `- **Immunities**: ${immunities.join(', ')}`;
      output.push(immunitiesString.replace(/;,/g, ';'));
    }
  }

  //Senses
  {
    let senses = new Array();

    if (data.senses)
    {
      data.senses.forEach(sense => {       
        senses.push(`${convertFeetString(sense)}`);
      });
    }
    
    senses.push(`passive perception ${data.passive}`);
    let sensesString = `- **Senses**: ${senses.join(', ')}`;
    output.push(sensesString);
  }

  // Languages
  {
    let languages = new Array();
    if (data.languages)
    {
      data.languages.forEach(language => {
        languages.push(strip5EToolsTags(language));
      });

      let languagesString = `- **Languages**: ${languages.join(', ')}`;
      output.push(languagesString);
    }
  }

  // Traits
  if (data.trait)
  {
    let array = convertMonsterSubSection("Traits", data.trait);  
    array.forEach(a => output.push(a));
  }

  // Spellcasting
  if (data.spellcasting)
  {
    data.spellcasting.forEach(spellcastingEntries => { 
      let spellcastingSection = new Array(); 
      spellcastingEntries.headerEntries.forEach(entry => {
        spellcastingSection.push(strip5EToolsTags(entry));
      });

      let spellcastingName = spellcastingEntries.name ? spellcastingEntries.name : 'Spellcasting';
      let spellsResult = `   - **${spellcastingName}**. ${spellcastingSection.join(', ')}`;
      output.push(spellsResult);

      if (spellcastingEntries.will)
      {
        let spellList = new Array();
        spellcastingEntries.will.forEach(spell => {
          spellList.push(strip5EToolsTags(spell));
        });
        
        let spellLevelString = `     - *At will*: ${spellList.join(', ')}`;
        output.push(spellLevelString);
      }

      if (spellcastingEntries.daily)
      {
        for (let key in spellcastingEntries.daily)
        {
          let value = spellcastingEntries.daily[key];
          let spellList = new Array();
          value.forEach(spell => {
            spellList.push(strip5EToolsTags(spell));
          });

          let perDay = key.match(/[0-9]+/);
          perDay = perDay ? `${perDay}/day each` : 'daily';
          let spellLevelString = `     - *${perDay}*: ${spellList.join(', ')}`;
          output.push(spellLevelString);
        }
      }

      for (let key in spellcastingEntries.spells)
      {
        let spellLevel = '';
        let value = spellcastingEntries.spells[key];
        if (parseInt(key) === 0)
        {
          spellLevel = `Cantrips`;
        }
        else
        {
          spellSlots = value.slots === 1 ? '(1 slot)' : `(${value.slots} slots)`;
          spellLevel = `Level ${key} ${spellSlots}`;
        }

        let spellList = new Array();
        value.spells.forEach(spell => {
          spellList.push(strip5EToolsTags(spell));
        });

        let spellLevelString = `     - *${spellLevel}*: ${spellList.join(', ')}`;
        output.push(spellLevelString);
      }
    });
  }

  // Actions
  if (data.action)
    {
      let array = convertMonsterSubSection("Actions", data.action);  
      array.forEach(a => output.push(a));
  }

  // Reactions
  if (data.reaction)
  {
    let array = convertMonsterSubSection("Reactions", data.reaction);  
    array.forEach(a => output.push(a));
  }

  let result = output.join('\n');  
  return result;
}

function convert5EJsonToText(json)
{
  let data = JSON.parse(json);
  let mdText = new Array();
  if (data.name)
  {    
    mdText.push(convert5EMonsterToText(data));
  }
  else if (data.length && data.length > 0)
  {
    data.forEach(item => {
      mdText.push(convert5EMonsterToText(item));
    });
  }

  let result = mdText.join('\n') + '\n';

  navigator.clipboard.writeText(result).then(() => {
    console.log("copied md to clipboard!");
  });
  return parseMd(result);
}