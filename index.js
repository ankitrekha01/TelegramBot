require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");

const token = process.env.TOKEN;

const bot = new TelegramBot(token,{
    polling:true
})

bot.on('text',(message)=>{
    /* fetch("https://api.rootnet.in/covid19-in/stats/latest")
    .then(res => res.json())
    .then((data)=>{
        console.log(data)
    }) */
    bot.getChatMembersCount(message.chat.id)
    .then((data)=>console.log(data))    
})