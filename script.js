/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Idle Adventurer Game
Author: ~*

Description:
This is an idle game with many upgrades and effects
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

////Defining Variables\\\\
const logTextElement = document.getElementById('log-text');
var logText = "";

////Common Functions\\\\
function WriteToLog(inpTxt){
    logText+="<br>"+inpTxt;
    logTextElement.innerHTML = "<p id='log-text'>"+logText+"</p>";
}

////Defining Classes\\\\
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
    }

    attack(enemy) {
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
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            WriteToLog(`${this.name} has been defeated!`);
            player.GainGold(Math.round(this.maxHealth/10));
            spawnNewEnemy();
        }
    }
}

const player = new Player('Hero');
let enemy = new Enemy('Goblin', 50);

function updateStats() {
    document.getElementById('playerName').innerText = `Name: ${player.name}`;
    document.getElementById('playerLevel').innerText = `Level: ${player.level}`;
    document.getElementById('playerHealth').innerText = `Health: ${player.health}`;
    document.getElementById('playerGold').innerText = `Gold: ${player.gold}`;
}

////UI FUNCTIONS\\\\
function attack() {
    player.attack(enemy);
    updateStats();
}

function inventory() {
    WriteToLog(`${player.name} checks inventory. (Display in canvas GUI)`);
}

function spawnNewEnemy() {
    enemy = new Enemy('Goblin', 50);
    WriteToLog('A new enemy has appeared!');
}

updateStats();



////Initializing game state\\\\

let lastTime = 0;
//const player = new Player("Username");


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



