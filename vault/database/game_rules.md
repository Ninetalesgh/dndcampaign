# Game Mechanics
## Basics

  Ability Scores | Description | Examples | Saving Throws
  :-- | :-- | :-- | :--
  Strength (STR) | Physical might | Lift, push, pull, or break something | Physically resist direct force
  Dexterity (DEX) | Agility, reflexes, and balance | Move nimbly, quickly, or quietly | Dodge out of harm's way 
  Costitution (CON) | Health and stamina | Push your body beyond normal limits | Endure a toxic hazard
  Intelligence (INT) | Reasoning and memory | Reason or remember | Recognize an illusion as fake
  Wisdom (WIS) | Perceptiveness and mental fortitude | Notice things in the environment or in creatures' behaviour | Resist a mental assault           
  Charisma (CHA) | Confidence, poise, and charm | Influence, entertain, or deceive | Assert your identity

>[!INFO] Whenever Abilities are mentioned in game we refer to the Modifier, not the score itself! The Modifier is always *(AbilityScore-10)/2* rounded down. For example, an Ability Score of 8 or 9 would result in -1, whereas an Ability Score of 14 or 15 would result in +2.

- **Proficiency Bonus (PB)** -> +2 on all tests you are proficient in, this will increase after level 4. This bonus does not stack, multiple proficiencies in the same skill don't give you +4, etc.  
- **Three Types of d20 Tests** -> Attack Roll, Ability Check, Saving Throw 
  - ***Attack Roll*** -> STR for melee, DEX for ranged, Varies for Spell Attack. Add your Proficiency Bonus if it's with a weapon you're proficient with or always add it if it's a Spell Attack. When you roll equal to or higher than your target's AC, you hit and roll the damage you do!
  - ***Ability Check*** -> Either roll on an Ability directly or on a Skill (Athletics, Acrobatics, etc.). Add your Proficiency Bonus to Ability Checks you are proficient in. 
    - ***Tools*** -> Proficiency stacks with Skills when Tools are used, if you have Proficiency in both the Skill and the Tool for an associated check you roll with Advantage.
  - ***Saving Throw*** -> Add your Proficiency Bonus if you're proficient in the Saving Throw of the Ability in question. I'll shorthand this to "Saves" in most places.
- **Advantage & Disadvantage** -> Roll twice on d20 tests, with Advantage you take the higher roll of the two, with Disadvantage you take the lower. Advantage and Disadvantage cancel each other out and never stack (for example, 3 sources of Advantage and 1 source of Disadvantage result in a normal roll).
- **Difficulty Class (DC)** -> Very easy 5, easy 10, medium 15, hard 20, Very hard 25, nearly impossible 30 
- **Armor Class (AC)** -> Your Base AC + DEX. You can only have one Base AC, by default that is 10.
- **Health Points (HP)** -> Your Health, when it drops to 0 you are on the brink of death! You can never have more HP than your HP maximum.
- **Long Rest (LR)** -> 8 Hours of rest (of which ~6 are sleep) to regain all your HP and Spell Slots and everything else that regenerates or refreshes after Long Rests.
- **Hit Dice** -> Type of dice that represents how tough you are depending on your class. You have an amount of Hit Dice equal to your Level. You regenerate all your Hit Dice after a Long Rest. 
- **Short Rest (SR)** -> 1 Hour of rest. Spend and roll as many Hit Dice as you want to regenerate HP. Some resources regenerate after Short Rests.

## Turn Based Play
While we're not playing Turn Based do what you want, ask the GM anything, role play ahead!
We play Turn Based in dangerous time sensitive situations like Combat. When we do, we use Initiative.

- Each **Round** of Initiative lets everyone (Players, NPCs and Monsters) take their turn once! Each Round takes roughly 6 seconds, which makes 1 minute = 10 Rounds. 
- We use a custom distance unit in game, it's just a unitless value and 1 unit is the size of one real world miniature square and equals *~1.5m* in the fantasy world. I'll always have both this unit and meters listed in rules. On table play one Inch (or one square on miniature terrain with a grid) equals 1 unit. When looking up online content which is displayed in *feet*, divide that value by 5 to get to our unitless value (for example 30 feet = 6).

The Round: 
> Roll Initiative at the beginning *(Are you Surprised or Hidden?)*
> Each Round is rougly 6 seconds.
> During each round everyone gets 1 Turn.

- **Roll Initiative** -> Roll a d20 + DEX, if you are Surprised you have Disadvantage on this roll, if you are [Invisible](conditions.md#invisible) (or Hidden) you have Advantage instead.

What you can do when we play Turn Based:

> **1 Movement!**
> **1 Action (A)** -> Your main thing!
> **1 Bonus Action (BA)** -> Hastily drink a potion? Also some Spells or Feats are Bonus Actions. 
> **1 Reaction (R)** -> Readied Action Trigger or Opportunity Attack?
> **1 Free Action** -> Something very minor, like open a door or push a button.
> **1 Shout something!**


- **Movement**: Move - up to a range equal to your Speed. You can do this in parts (for example, move 1, use Action, move 4, use Bonus Action, move 1).
  - Move slower through Difficult Terrain. Low furniture, rubble, undergrowth, steep stairs, snow, and shallow bogs are examples. 
  - You can also fall Prone at will, of course.
  - *ON GRIDS ONLY*: Diagonal movement costs 3/2, rounding down the total (so 2 full diagonal "steps" cost 3) 
- **Actions**
- ***Attack*** -> Melee, Ranged, Spell. If you roll a 20 on an attack roll you score a ***Critical Hit***, which lets you double ALL the damage *dice* (for example, if you would deal 1d6+4 damage, you deal 2d6+4 damage instead).
  - *Melee Attack* -> Attack something in range, unless otherwise specified, your Melee Attack range is 1 (so you can attack things directly next to you).
  - *Ranged Attack* -> Attack something in range of your Ranged Attack. If the target is within range 1 or above normal range, you attack with Disadvantage.
  - *Spell Attack* -> Attack something in range of your Spell Attack. If the target is within range 1 you attack with Disadvantage.
- ***Dash*** -> Double your Movement Speed for this turn.
- ***Disengage*** -> Your movement doesn't provoke Opportunity Attacks for the rest of the turn.
- ***Dodge*** -> Until the start of your next turn, attacks against you have Disadvantage and you get Advantage on DEX Saves.
- ***Hide*** -> Make a DEX (Stealth) Check to attempt to hide!
- ***Magic*** -> Cast a Spell or use a Magical Feature that needs your Action, or use a Magic Item.
- ***Ready*** -> Prepare to take your Action outside of your turn in response to a trigger you define (for example "I hide behind the door and will attack the first enemy that runs in").
- ***Influence / Search / Study / Utilize / Stabilize*** -> Do something in the heat of the moment, whatever you try might be accomplished right away or at least get you on the right track!
  - Influence a creature, like talk them down, distract them, or alter their attitude some other way. (Usually CHA)
  - Try to find something, like the source of some poison gas, the hidden switch on the wall to open the secret door, etc. (Usually WIS)
  - Study something, like a spell that an evildoer cast, find out where interleaved mechanical switches lead to understand what would happen if you flipped some switch, or how tree roots are growing towards a source of some energy. (Usually INT)
  - Versatile -> Use, or do something with, some object, whatever it might be.
  - Attempt to stabilize another character on the brink of death, at 0 HP, with a WIS (Medicine) Check. 
- ***Help*** -> Help someone elses Ability Check or Attack Roll, giving them Advantage. 
- **Drink Potion** -> Drink carefully, regenerate the maximum rollable result.
- **Bonus Actions**
  - **Drink Potion** -> Drink fast! Roll dice! Spill some! 
- **Reaction**
  - **Opportunity Attack** -> Melee Attack someone who moves out of your Melee range (not if they're pushed or otherwise physically moved by force).
  - **Ready Action Trigger** -> Trigger the Action you readied!


## Advanced Rules

- **Temporary HP (THP)** -> Extra health that allows you to go above your HP max, usually from some invigorating or morale boosting effect. You can only ever have one THP pool and they don't stack (for example, if you have 6 THP and would gain 10 THP from some effect, your THP becomes the higher one, in this case 10). THP are not healing.
- **Death Saves & Death** -> When you hit 0 HP you are [Unconscious](conditions.md#unconscious).

### Damage Types

> **Resistance** to a Damage Type halves all damage of that type you take (round down),
> **Vulnerability** doubles it.
> **Immunity** reduces all damage of that type to 0.

  - **Piercing** -> Acupuncture.
  - **Slashing** -> Cut things.
  - **Bludgeoning** -> Bonk.
  - **Poison** -> McDonalds.
  - **Fire** -> Hottie.
  - **Cold** -> Very icy.
  - **Lightning** -> That's shocking.
  - **Acid** -> Alien blood and chemicals.
  - **Thunder** -> VERY LOUD THINGS.
  - **Necrotic** -> Rot, death of flesh.
  - **Radiant** -> Holy fire and sun lasers.
  - **Force** -> Energy.
  - **Psychic** -> Brain Hurty.

### Vision & Light

- **Bright Light** -> See normally. Even gloomy daus provide Bright Light, as do torches, lanterns, fires, and other sources of illumination with specific radius.
- **Dim Light** -> Lightly Obscured area. Dim Light is usally a boundary between Bright Light and surrounding Darkness. The soft light of twilight and dawn also counts as Dim Light, so does for example a full moon.
  - Lightly Obscured means Disadvantage on WIS (Perception) to see. 
- **Darkness** -> Heavily Obscured area. Characters face Darkness outdoors at night, withing the confines of an unlit dungeon, or in an area of magical Darkness.
  - Attempting to see something Heavily Obscured is mechanically equivalent to being [Blinded](conditions.md#blinded).
#### Special senses
- **Blindsight** -> sense things moving around you.
- **Darkvision** -> see in darkness like a cat.
- **Tremorsense** -> like a snake you can feel the ground vibrations.
- **Truesight** -> See invisible things.

### Cover
Draw lines from one corner of the your square to 4 corners of one of the squares of the creature you're attacking. If ANY line is obstructed, the target is behind Cover and gains benefits of at least Half Cover.

Cover | Benefit
:-- | :--
Half | +2 AC and DEX Saves
Three-Quarter | +5 AC and DEX Saves
Total | Can't be targeted directly

Example Cover:
![Image|400](https://i.imgur.com/keobl8S.png)

### Creature Sizes

Size | Squares
:-- | :--
Tiny | 1/4
Small | 1 
Medium | 1
Large | 4
Huge | 9
Gargantuan | 16

### Creature Types

- **Aberration** ->  (Usually Arcana)
- **Beast** ->  (Usually Nature)
- **Celestial** ->  (Usually Religion)
- **Construct** ->  (Usually Arcana)
- **Dragon** ->  (Usually Nature)
- **Elemental** ->  (Usually Arcana)
- **Fey** ->  (Usually Arcana)
- **Fiend** ->  (Usually Religion)
- **Giant** ->  (Usually History)
- **Humanoid** ->  (Usually History)
- **Monstrosity** ->  (Usually Arcana)
- **Ooze** ->  (Usually Nature)
- **Plant** ->  (Usually Nature)
- **Undead** ->  (Usually Religion)

### Spell Casting

[TODO]
Spell Slots, Visual, Semantic, Ritual, Concentration
Only one Spell Slot consume per Turn. 

### Magic Items

Every player can have up to 3 magic items attuned.
 [TODO]
  Magic items are noticably magical when you handle them.
  One item can be identified per SR.
  A maximum of 3 attunements total.
  One item can be attuned per SR.
  One item can be unattuned per SR.

### Weapons and Armor Types
#### Simple Melee Weapons
- Club
- Dagger
- Greatclub
- Handaxe
- Javelin
- Light Hammer
- Mace
- Quarterstaff
- Sickle
- Spear
#### Simple Ranged Weapons
- Dart
- Light Crossbow
- Shortbow
- Sling
#### Martial Melee Weapons
- Battleaxe 
- Flail 
- Glaive 
- Greataxe 
- Greatsword
- Halberd
- Lance 
- Longsword
- Maul
- Morningstar
- Pike 
- Rapier
- Scimitar
- Shortsword
- Trident 
- Warhammer 
- War Pick 
- Whip 
#### Martial Ranged Weapons
- Blowgun 
- Hand Crossbow 
- Heavy Crossbow
- Longbow 
- Musket 
- Pistol 
#### Armor Types
- Light Armor
- Medium Armor
- Heavy Armor
- Shields

### Weapon Mastery Actions
#### Cleave
  Allowed to make a second attack against another creature within 1 range of the first target also within your reach, without damage modifier.
#### Graze
  Still deal <1d4> + Damage Modifier when missing an attack.
#### Nick
  Allowed to make the additional attack you receive from wielding two Light weapons as part of the initial attack action.
#### Push
  Allowed to push a creature by <1d4>-1 you hit. (STR/DEX save?)
#### Sap
  Target you hit gets disadvantage on its next attack.
#### Slow
  Reduces movement speed by <1d4> on hit.
#### Topple
  Knock target Prone on hit. (CON/STR/DEX save?)
#### Vex
  On hit, choose ally to give advantage on the target for their next hit.
#### Brace
  Can opportunity attack when enemy enters range.
#### Rush
  Can move an extra <1d4> to attack.


### Character Needs

Only relevant when resources become scarce.

Per day:
- About 3 liters of fluid. If you consume less than half of that you gain 1 [Exhaustion](conditions.md#exhaustion).
- About 500g of food. If you consume less than half of that you must succeed on a DC 10 CON Save or gain 1 Exhaustion. Starting at day 5 you additionally gain 1 Exhaustion at the end of every day without Save. 

Exhaustion caused by dehydration or malnutrition can't be removed unless you consume a daily portion of fluid or food respectively. 