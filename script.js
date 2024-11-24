/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Idle Adventurer Game
Author: ~*

Description:
This is an idle game with many upgrades and effects
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

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
class Stat {
    constructor(name, value) {
        this.name=name;
        this.value=value;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.health = 100;
        this.gold = 0;
        this.attackPower = 2;
        this.attackSpeed = 1;
        this.defence = 10;
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




//#region UI FUNCTIONS \\\
function updateStats() {
    playerName_Element.innerText = `${player.name}`;
    playerLevel_Element.innerText = `${player.level}`;
    playerHealth_Element.innerText = `${player.health}`;
    playerGold_Element.innerText = `${player.gold}`;
    playerAttack_Element.innerText = `${player.attackPower}`;
    playerAttackSpeed_Element.innerText = `${player.attackSpeed}`;
    playerDefence_Element.innerText = `${player.defence}`;

    document.getElementById('enemyName').innerText = `${player.target.name}`;
    document.getElementById('enemyLevel').innerText = `${player.target.level}`;
    document.getElementById('enemyHealth').innerText = `${player.target.health}`;
    document.getElementById('enemyGold').innerText = `${player.target.gold}`;
}

function attack() {
    player.attack(player.target);
    updateStats();
}


function spawnNewEnemy() {
    enemy = new Enemy(generateRandomEnemyName(), 50);
    player.target=enemy;
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

    // Random properties (attack, defence, and price)
    const attack = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    const defence = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    const price = Math.floor(Math.random() * (200 - 10 + 1)) + 10;

    const randomNewItem = `{"name":"${fullItemName}", "description": "${randomDescription}", "price": "${price}", "attack": "${attack}", "defence": "${defence}", "itemType": "${randomItemType}"}`;
    
    // Construct the item template
    const itemTemplate = `
        <tr class="itemInShop">
            <td>
                <b>${fullItemName}</b><br>
                <i>${randomDescription}</i>
            </td>
            <td>
                ${attack}<b></b>⚔️<br>${defence}<b></b>🛡️
            </td>
            <td>${price}&#164;</td>
            <td>
                <input style="width:100%;" type="submit" name="buy" value="Buy!" onclick="BuyItem(event)" />
                <input type="hidden" name="name" value="${fullItemName}">
                <input type="hidden" name="description" value="${randomDescription}">
                <input type="hidden" name="price" value="${price}">
                <input type="hidden" name="attack" value="${attack}">
                <input type="hidden" name="defence" value="${defence}">
                <input type="hidden" name="itemType" value="${randomItemType}">
            </td>
        </tr>
    `;
    return [randomNewItem, itemTemplate];
}

function BuyItem(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the hidden input values
    const itemName = event.target.parentElement.querySelector('input[name="name"]').value;
    const itemDescription = event.target.parentElement.querySelector('input[name="description"]').value;
    const itemPrice = event.target.parentElement.querySelector('input[name="price"]').value;
    const itemAttack = event.target.parentElement.querySelector('input[name="attack"]').value;
    const itemDefence = event.target.parentElement.querySelector('input[name="defence"]').value;
    const itemType = event.target.parentElement.querySelector('input[name="itemType"]').value;

    // Create the item object
    const newItem = {
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        attack: itemAttack,
        defence: itemDefence,
        itemType: itemType
    };

    // Add the item to the inventory array
    player.inventory.push(newItem);

    // Optionally, update the UI to reflect the new inventory
    console.log('Item added to inventory:', newItem);
    console.log('Current inventory:', player.inventory);
    updateInventoryUI();
}

function drawInventoryTable() {
    // Create the table element
    const table = inventoryTable_Element;
    items=player.inventory;
    table.border = '1';

    // Create the table header
    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const headers = ['Name', 'Description', 'Price', 'Attack', 'Defence', 'Item Type'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(th);
    });

    // Create the table body
    const tbody = table.createTBody();
    items.forEach(item => {
        const row = tbody.insertRow();
        Object.values(item).forEach(value => {
            const cell = row.insertCell();
            cell.innerHTML = value;
        });
    });

    // Append the table to the document body or a specific element
    document.body.appendChild(table);
}

function updateInventoryUI() {
    // Get the inventory table element (assuming it has an ID of 'inventory-table')
    const table = inventoryTable_Element;

    // Clear the existing table content
    table.innerHTML = '';

    // Create the table header
    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const headers = ['Name', 'Description', 'Price', 'ATK', 'DEF'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(th);
    });

    // Create the table body
    const tbody = table.createTBody();
    
    player.inventory.forEach(item => {
        const row = tbody.insertRow();

        const cell1 = row.insertCell();
        cell1.innerHTML = item.name;

        const cell2 = row.insertCell();
        cell2.innerHTML = item.description;

        const cell3 = row.insertCell();
        cell3.innerHTML = item.price;

        const cell4 = row.insertCell();
        cell4.innerHTML = item.attack;

        const cell5 = row.insertCell();
        cell5.innerHTML = item.defence;

        /*
        Object.values(item).forEach(value => {
            const cell = row.insertCell();
            cell.innerHTML = value;
        });
        */
    });
    
}


//#endregion UI FUNCTIONS \\

////Initializing game state\\\\
const logTextElement = document.getElementById('log-text');
var logText = "";
const upgradeListElement = document.getElementById('upgrade-list');
const playerName_Element = document.getElementById('playerName');
const playerLevel_Element = document.getElementById('playerLevel');
const playerHealth_Element = document.getElementById('playerHealth');
const playerGold_Element = document.getElementById('playerGold');
const playerAttack_Element = document.getElementById('playerAttack');
const playerAttackSpeed_Element = document.getElementById('playerAttackSpeed');
const playerDefence_Element = document.getElementById('playerDefence');
const inventoryTable_Element = document.getElementById('inventory-table');
const EQUIPMENT_HEAD = 'head'; const EQUIPMENT_TORSO = 'torso'; const EQUIPMENT_LEGS = 'legs'; const EQUIPMENT_FEET = 'feet'; const EQUIPMENT_WEAPON = 'weapon';
let lastTime = 0;


const player = new Player('Hero');
let enemy = new Enemy('Goblin', 50);

player.target=enemy;
updateStats();

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



