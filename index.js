require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const Intl = require('intl');
const axios = require('axios') 
//this library is used beacse toLocaleString wasn't working 
const token = process.env.TOKEN;

const bot = new TelegramBot(token,{
    polling:true
})
     fetch("https://api.rootnet.in/covid19-in/stats/latest")
    .then(res => res.json())
    .then((data)=>{
        bot.on('text',(message)=>{
            if(message.text.toLowerCase()=="india" || message.text.toLowerCase()== "ind"){
                    bot.sendMessage(message.chat.id,`Covid-19 in India
Total cases   :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.total))}
Deaths           :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.deaths))}
Recovered    :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.discharged))}
                    `);
            }

            
            data.data.regional.forEach((loc)=>{
                if(loc.loc.toLowerCase()=== message.text.toLowerCase()){
                    bot.sendMessage(message.chat.id,`Covid-19 in ${loc.loc}
Total cases   :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.totalConfirmed))}
Deaths           :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.deaths))}
Recovered    :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.discharged))}
                    `);
                }
            })
        })
    }) 

    /* no. of members
    bot.getChatMembersCount(message.chat.id)
    .then((data)=>console.log(data))
    */ 
