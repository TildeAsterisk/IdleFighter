/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Idle Adventurer Game
Author: ~*

Description:
This is an idle game with many upgrades and effects
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

////Defining Variables\\\\
const logTextElement = document.getElementById('log-text');
var logText = "";
const upgradeListElement = document.getElementById('upgrade-list');

////Common Functions\\\\
function WriteToLog(inpTxt){
    logText+="<br>"+inpTxt;
    logTextElement.innerHTML = logText;
}

function generateRandomEnemyName() {
    const adjectives = ["Fierce", "Sinister", "Vengeful", "Dreadful", "Malevolent", "Fancy", "Sinister", "Vivacious", "Quirky", "Radiant", "Melancholic", "Surreal", "Zesty", "Ethereal", "Whimsical", "Resilient", "Inquisitive", "Serene", "Luminous", "Mysterious", "Exuberant", "Gloomy", "Captivating", "Dynamic", "Harmonious", "Eloquent", "Jubilant", "Nebulous", "Enchanting", "Audacious", "Tranquil", "Pensive", "Effervescent", "Candid", "Ephemeral", "Euphoric", "Sardonic", "Bewitched", "Placid", "Vibrant", "Tenacious", "Spirited", "Elusive", "Solemn", "Furtive", "Lively", "Enigmatic", "Soothing", "Zealous", "Wistful", "Chimerical", "Incandescent"];
    const nouns = ["Dragon", "Orc", "Serpent", "Wraith", "Goblin", "Troll", "Banshee", "Harpy", "Minotaur", "Wyvern", "Lich", "Cyclops", "Basilisk", "Chimera", "Succubus", "Zombie", "Ghoul", "Vampire", "Werewolf", "Manticore", "Kraken", "Siren", "Gargoyle", "Imp", "Ghost", "Skeleton", "Centaur", "Medusa", "Djinn", "Slime", "Specter", "Gnoll", "Harbinger", "Revenant", "Crawler", "Shadow", "Naga", "Elemental", "Griffon", "Banshee", "Lamia", "Cerberus", "Satyr", "Gorgon", "Bogeyman", "Chupacabra"];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    const enemyName = `${randomAdjective} ${randomNoun}`;
    return enemyName;
}


//#region Defining Classes\\\\
class Player {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.health = 100;
        this.gold = 0;
        this.attackPower = 10;
        this.attackSpeed = 1;
        this.lastAttackTime = 0; // Initialize to current timestamp
        this.attackCooldown=1000 / this.attackSpeed; //milliseconds per attack
        this.upgradesList = [];
        this.inventory=[];
        this.target=null;
    }

    attack(enemy) {
        this.target=enemy;
        enemy.takeDamage(this.attackPower);
        WriteToLog(`${this.name} attacks ${enemy.name} for ${this.attackPower} damage!`);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            WriteToLog(`${this.name} has been defeated!`);
        }
    }

    levelUp() {
        this.level++;
        this.health += 20;
        this.attackPower += 5;
        WriteToLog(`${this.name} leveled up to level ${this.level}!`);
    }

    GainGold(goldGained){
        this.gold += goldGained;
        WriteToLog(`${this.name} gained ${goldGained} pieces of gold.`);
    }
}

class Enemy {
    constructor(name, health) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.gold = Math.round(this.maxHealth/10);
        this.level = player.level;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            WriteToLog(`${this.name} has been defeated!`);
            player.GainGold(this.gold);
            spawnNewEnemy();
        }
    }
}

class Upgrade{
    constructor(name,description,stat){
        this.name=name;
        this.description=description;
        this.stat=stat;

        this.html=this.GenerateHTML();
    }

    GenerateHTML(){
        var itemTemplate = `
            <tr class="upgrade-item">
                <td>
                    <b>${this.name}</b><br>
                    <i>${this.description}</i>
                </td>
                <td>
                    ${this.stat}<b></b>&#164;
                </td>
                <td><button>0</button></td>
            </tr>
                <tr><td><hr></td> <td><hr></td> <td><hr></td>
            </tr>`;
        return itemTemplate;
    }   
}
//#endregion CLASSES \\

const player = new Player('Hero');
let enemy = new Enemy('Goblin', 50);

//#region UI FUNCTIONS \\\
function updateStats() {
    document.getElementById('playerName').innerText = `${player.name}`;
    document.getElementById('playerLevel').innerText = `${player.level}`;
    document.getElementById('playerHealth').innerText = `${player.health}`;
    document.getElementById('playerGold').innerText = `${player.gold}`;

    document.getElementById('enemyName').innerText = `${enemy.name}`;
    document.getElementById('enemyLevel').innerText = `${enemy.level}`;
    document.getElementById('enemyHealth').innerText = `${enemy.health}`;
    document.getElementById('enemyGold').innerText = `${enemy.gold}`;
}

function attack() {
    player.attack(enemy);
    updateStats();
}

function inventory() {
    WriteToLog(`${player.name} checks inventory. (Display in canvas GUI)`);
}

function spawnNewEnemy() {
    enemy = new Enemy(generateRandomEnemyName(), 50);
    WriteToLog('A new enemy has appeared!');
}


function GenerateRandomItem(itemType = null) {
    // Select random item type
    const itemTypes = [EQUIPMENT_HEAD, EQUIPMENT_TORSO, EQUIPMENT_LEGS, EQUIPMENT_FEET];
    let randomItemType;
    if (itemType === null) {
        randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    } else {
        randomItemType = itemType;
    }

    const adjectives = ["Fierce", "Sinister", "Vengeful", "Dreadful", "Malevolent", "Fancy", "Sinister", "Vivacious", "Quirky", "Radiant", "Melancholic", "Surreal", "Zesty", "Ethereal", "Whimsical", "Resilient", "Inquisitive", "Serene", "Luminous", "Mysterious", "Exuberant", "Gloomy", "Captivating", "Dynamic", "Harmonious", "Eloquent", "Jubilant", "Nebulous", "Enchanting", "Audacious", "Tranquil", "Pensive", "Effervescent", "Candid", "Ephemeral", "Euphoric", "Sardonic", "Bewitched", "Placid", "Vibrant", "Tenacious", "Spirited", "Elusive", "Solemn", "Furtive", "Lively", "Enigmatic", "Soothing", "Zealous", "Wistful", "Chimerical", "Incandescent"];
    const materials = ["Iron", "Wood", "Bronze", "Gold", "Steel", "Stone", "Crystal", "Serpent's Fang", "Ivory", "Silk", "Leather", "Cloth", "Obsidian", "Mithril", "Adamantium", "Diamond", "Emerald", "Ruby", "Sapphire", "Topaz", "Amber", "Pearl", "Quartz", "Velvet", "Linen", "Wool", "Fur", "Dragonhide", "Titanium", "Platinum", "Bone", "Copper", "Silver", "Plastic", "Rubber", "Carbon Fiber", "Kevlar", "Graphene", "Scale", "Fabric", "Alloy", "Hide", "Essence"];

    const equipmentNames = {
        [EQUIPMENT_WEAPON]: ["Blade", "Axe", "Dagger", "Staff", "Bow", "Sword", "Mace", "Spear", "Wand", "Crossbow", "Chakram", "Sickle", "Whip", "Shuriken", "Boomerang", "Sling", "Harpoon", "Cudgel", "Halberd", "Trident", "Flail", "Rapier", "Morning Star", "Warhammer", "Javelin", "Nunchaku", "Scythe", "Katar", "Bolas", "Kusarigama", "Tessen", "Chigiriki", "Kama", "Naginata", "Tanto", "Glaive", "Khopesh", "Estoc", "Falchion", "Claymore", "Zweihander", "Katana", "Cutlass", "Rondel", "Tomahawk", "War Fan", "Quarterstaff", "Sai", "Kris"],
        [EQUIPMENT_HEAD]:   ["hat", "helm", "cowboy hat", "hood", "mask", "tiara", "crown", "cap", "visor", "headband", "beanie", "beret", "bonnet", "balaclava", "coif", "circlet", "veil", "turban", "fez", "tricorn", "toque", "miter", "snood", "visor", "headdress", "bandana", "scarf", "headscarf", "headwrap", "headpiece", "diadem", "coronet", "tiara", "wimple", "chapeau", "tam", "bowler", "top hat", "fedora", "sombrero", "panama hat", "boater", "derby", "pork pie hat", "newsboy cap", "flat cap", "baseball cap", "snapback", "bucket hat", "beanie", "beret", "visor", "balaclava", "cowl", "hood", "mask", "veil", "turban", "scarf", "headscarf", "headwrap", "headpiece", "tiara", "diadem", "cap", "helmet", "coif", "circlet", "visor", "headdress", "bandana", "snood"],
        [EQUIPMENT_TORSO]:  ["Shirt", "Tunic", "Vest", "Chestplate", "Breastplate", "Hauberk", "Cuirass", "Tabard", "Doublet", "Jerkin", "Gambeson", "Leather Armor", "Plate Mail", "Chainmail", "Scale Mail", "Ringmail", "Bulletproof Vest", "Flak Jacket", "Shoulder Pads", "Pauldrons", "Spaulders", "Arm Bracers", "Elbow Guards", "Armored Gauntlets", "Tassets", "Faulds", "Loincloth", "Hip Guards", "Thigh Plates", "Greaves", "Cuisses", "Knee Guards", "Shin Guards", "Sabatons"],
        [EQUIPMENT_LEGS]:   ["Greaves", "Cuisses", "Knee Guards", "Shin Guards", "Sabatons", "Shorts", "Pants", "Leggings", "Tights", "Jeans", "Cargo Pants", "Joggers", "Capris", "Sweatpants", "Overalls", "Skirt", "Kilt", "Trousers", "Chinos", "Culottes", "Harem Pants", "Palazzo Pants", "Bell-bottoms", "Hot Pants", "Bermuda Shorts", "Board Shorts", "Cycling Shorts", "Track Pants", "Snow Pants", "Gaiters", "Garters", "Leg Warmers", "Thigh-high Stockings", "Knee-high Socks", "Ankle Socks", "Compression Socks"],
        [EQUIPMENT_FEET]:   ["Boots", "Shoes", "Sandals", "Slippers", "Sneakers", "High Heels", "Steel-Toed Boots", "Combat Boots", "Hiking Boots", "Work Boots", "Snow Boots", "Rain Boots", "Flip-Flops", "Moccasins", "Espadrilles", "Waders", "Clogs", "Loafers", "Oxfords", "Platform Shoes", "Thigh-High Boots", "Ankle Boots", "Wellington Boots", "Gaiters", "Sabatons"]
    };

    let randomName;
    switch (randomItemType) {
        case EQUIPMENT_WEAPON:
            randomName = equipmentNames[EQUIPMENT_WEAPON][Math.floor(Math.random() * equipmentNames[EQUIPMENT_WEAPON].length)];
            break;
        case EQUIPMENT_HEAD:
            randomName = equipmentNames[EQUIPMENT_HEAD][Math.floor(Math.random() * equipmentNames[EQUIPMENT_HEAD].length)];
            break;
        case EQUIPMENT_TORSO:
            randomName = equipmentNames[EQUIPMENT_TORSO][Math.floor(Math.random() * equipmentNames[EQUIPMENT_TORSO].length)];
            break;
        case EQUIPMENT_LEGS:
            randomName = equipmentNames[EQUIPMENT_LEGS][Math.floor(Math.random() * equipmentNames[EQUIPMENT_LEGS].length)];
            break;
        case EQUIPMENT_FEET:
            randomName = equipmentNames[EQUIPMENT_FEET][Math.floor(Math.random() * equipmentNames[EQUIPMENT_FEET].length)];
            break;
        default:
            randomName = "Non-Equipment Item";
            break;
    }

    // Add Adjectives and descriptor to name
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
    // Capitalize all
    const capitalizedAdjective = randomAdjective.charAt(0).toUpperCase() + randomAdjective.slice(1);
    const capitalizedMaterial = randomMaterial.charAt(0).toUpperCase() + randomMaterial.slice(1);
    const capitalizedName = randomName.charAt(0).toUpperCase() + randomName.slice(1);
    // Combine to make full item name
    const fullNameCombos = [`${capitalizedAdjective} ${capitalizedName} of ${capitalizedMaterial}`, `${capitalizedAdjective} ${capitalizedMaterial} ${capitalizedName}`];
    const fullItemName = fullNameCombos[Math.floor(Math.random() * fullNameCombos.length)];

    // Random item description
    const itemDescriptions = [
        `A ${capitalizedAdjective} ${capitalizedName} crafted out of ${capitalizedMaterial}.<br><b>[${randomItemType}]</b>`,
        `This ${capitalizedName} is named the \`${capitalizedAdjective}\` by its creator who made out of ${capitalizedMaterial}.<br><b>[${randomItemType}]</b>`,
        `The ${capitalizedMaterial} ${capitalizedName} has a small written marking on it reading <i>\`${capitalizedAdjective}\`</i>.<br><b>[${randomItemType}]</b>`
    ];
    const randomDescription = itemDescriptions[Math.floor(Math.random() * itemDescriptions.length)];

    // Random properties (attack, defense, and price)
    const attack = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    const defense = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    const price = Math.floor(Math.random() * (200 - 10 + 1)) + 10;

    const randomNewItem = `{"name":"${fullItemName}", "description": "${randomDescription}", "price": "${price}", "attack": "${attack}", "defense": "${defense}", "itemType": "${randomItemType}"}`;
    
    // Construct the item template
    const itemTemplate = `
        <tr class="itemInShop">
            <td>
                <b>${fullItemName}</b><br>
                <i>${randomDescription}</i>
            </td>
            <td>
                ${attack}<b></b>⚔️<br>${defense}<b></b>🛡️
            </td>
            <td>${price}&#164;</td>
            <td>
                <input style="width:100%;" type="submit" name="buy" value="Buy!" />
                <input type="hidden" name="name" value="${fullItemName}">
                <input type="hidden" name="description" value="${randomDescription}">
                <input type="hidden" name="price" value="${price}">
                <input type="hidden" name="attack" value="${attack}">
                <input type="hidden" name="defense" value="${defense}">
                <input type="hidden" name="itemType" value="${randomItemType}">
            </td>
        </tr>
    `;
    return [randomNewItem, itemTemplate];
}

//#endregion UI FUNCTIONS \\

////Initializing game state\\\\
const EQUIPMENT_HEAD = 'head'; const EQUIPMENT_TORSO = 'torso'; const EQUIPMENT_LEGS = 'legs'; const EQUIPMENT_FEET = 'feet'; const EQUIPMENT_WEAPON = 'weapon';
updateStats();
let lastTime = 0;

//const player = new Player("Username");
upgradeListElement.innerHTML = GenerateRandomItem()[1]+GenerateRandomItem()[1]+GenerateRandomItem()[1]+GenerateRandomItem()[1]+GenerateRandomItem()[1]+GenerateRandomItem()[1];


function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;


    // Check if it's time to attack 
    if (timestamp - player.lastAttackTime >= player.attackCooldown) { 
        attack(); 
        player.lastAttackTime = timestamp; 
    }

    updateStats();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);



