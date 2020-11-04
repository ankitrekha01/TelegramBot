require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const Intl = require('intl');
//this library is used because toLocaleString wasn't working 
const axios = require('axios') 
const token = process.env.TOKEN;

const bot = new TelegramBot(token,{
    polling:true
})
     fetch("https://api.rootnet.in/covid19-in/stats/latest")
    .then(res => res.json())
    .then((data)=>{
        bot.on('text',(message)=>{
            var match=0;
            if(message.text.toLowerCase()=="india" || message.text.toLowerCase()== "ind"){
                match=1;
                    bot.sendMessage(message.chat.id,`Covid-19 in India
Total cases   :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.total))}
Deaths           :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.deaths))}
Recovered    :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.discharged))}
                    `);
            }
            var m= message.text.toLowerCase()
            data.data.regional.forEach((loc)=>{
                if(m=="andaman"||m=="andaman&nicobar"||m=="island"){
                    message.text="Andaman and Nicobar Islands"
                }
                else if(m=="andhra"){
                    message.text = "Andhra Pradesh"
                }
                else if(m=="arunachal"){
                    message.text = "Arunachal Pradesh"
                }
                else if(m=="dadra and nagar haveli"||m=="daman and diu"){
                    message.text = "Dadra and Nagar Haveli and Daman and Diu"
                }
                else if(m=='himachal'){
                    message.text = "Himachal Pradesh"
                }
                else if(m=="jammu"||m=="kashmir"||m=="j&k"){
                    message.text='Jammu and Kashmir'
                }
                else if(m=="bengal"){
                    message.text ="West Bengal"
                }


                if(loc.loc.toLowerCase()=== message.text.toLowerCase()){
                    match=1;
                    bot.sendMessage(message.chat.id,`Covid-19 in ${loc.loc}
Total cases   :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.totalConfirmed))}
Deaths           :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.deaths))}
Recovered    :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.discharged))}
                    `);
                }
            })
            if(match!=1){
                if(message.text=="/start"){

                }else{
                    bot.sendMessage(message.chat.id,"Not Found")
                }
            }
        })
    })
    
    //https://www.googleapis.com/youtube/v3/search?q=hello&part=snippet&type=video&key=AIzaSyD3HahrJCN2LAuk8O8xHXbqXVuf4WP9j2g
    //maxResults=10 can also be used
    /* no. of members
    bot.getChatMembersCount(message.chat.id)
    .then((data)=>console.log(data))
    */ 
