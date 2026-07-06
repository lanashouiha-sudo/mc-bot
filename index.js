const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is Online'));
app.listen(process.env.PORT || 3000);

const botOptions = {
    host: 'VITOOSOLO.aternos.me', 
    port: 51185,                  
    username: 'PvP_Trainer',       
    version: '1.20.1' 
};

let bot;

function createBot() {
    bot = mineflayer.createBot(botOptions);

    bot.on('spawn', () => {
        console.log('Bot spawned in the server');
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
        console.log('Connection lost. Reconnecting in 15 seconds...');
        setTimeout(createBot, 15000);
    });

    bot.on('error', (err) => console.log('Error: ', err));
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
