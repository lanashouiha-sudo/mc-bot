const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Online'));
app.listen(process.env.PORT || 3000);

const botOptions = {
    host: 'VITOOSOLO.aternos.me', 
    port: 51185,                  
    username: 'PvP_Trainer',       
    version: '1.21.11' 
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        equipShield();
    });

    bot.on('damaged', () => {
        equipShield();
    });

    bot.on('physicsTick', () => {
        if (!bot.isUsingItem()) {
            bot.activateItem(); 
        }
    });

    bot.on('end', () => {
        setTimeout(createBot, 15000);
    });

    bot.on('error', (err) => console.log(err));
}

function equipShield() {
    const shield = bot.inventory.items().find(item => item.name.includes('shield'));
    if (shield) {
        bot.equip(shield, 'off-hand', (err) => {
            if (!err) bot.activateItem();
        });
    } else {
        bot.chat('/give @s minecraft:shield');
        setTimeout(() => {
            const newShield = bot.inventory.items().find(item => item.name.includes('shield'));
            if (newShield) bot.equip(newShield, 'off-hand', () => bot.activateItem());
        }, 1000);
    }
}

createBot();
