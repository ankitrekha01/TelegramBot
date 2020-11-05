require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
const Intl = require('intl');
//this is used because toLocaleString wasn't working 
const axios = require('axios')
const token = process.env.TOKEN;

const bot = new TelegramBot(token, {
    polling: true
})

var accessYoutubeApi = "https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyD3HahrJCN2LAuk8O8xHXbqXVuf4WP9j2g&id=";
var regex = /(www.youtube.com)/gm;
var matchRegion = 0;
//just id is missing which we get using url
fetch("https://api.rootnet.in/covid19-in/stats/latest")
    .then(res => res.json())
    .then((data) => {
        bot.onText(/\/covid/, (message, match) => {
            if (match.input == "/covid") {
                bot.sendMessage(message.chat.id, "No input")
            } else {
                const region = match.input.split(' ')[1];
                if (region.toLowerCase() == "india" || region.toLowerCase() == "ind") {
                    matchRegion = 1;
                    bot.sendMessage(message.chat.id, `Covid-19 in India
Total cases   :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.total))}
Deaths           :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.deaths))}
Recovered    :  ${new Intl.NumberFormat('en-IN').format(parseInt(data.data.summary.discharged))}
                    `);
                }
                var m = region.toLowerCase()
                data.data.regional.forEach((loc) => {
                    if (m == "andaman" || m == "andaman&nicobar" || m == "island") {
                        region = "Andaman and Nicobar Islands"
                    } else if (m == "andhra") {
                        region = "Andhra Pradesh"
                    } else if (m == "arunachal") {
                        region = "Arunachal Pradesh"
                    } else if (m == "dadra and nagar haveli" || m == "daman and diu") {
                        region = "Dadra and Nagar Haveli and Daman and Diu"
                    } else if (m == 'himachal') {
                        region = "Himachal Pradesh"
                    } else if (m == "jammu" || m == "kashmir" || m == "j&k") {
                        region = 'Jammu and Kashmir'
                    } else if (m == "bengal") {
                        region = "West Bengal"
                    }


                    if (loc.loc.toLowerCase() === region.toLowerCase()) {
                        matchRegion = 1;
                        bot.sendMessage(message.chat.id, `Covid-19 in ${loc.loc}
Total cases   :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.totalConfirmed))}
Deaths           :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.deaths))}
Recovered    :  ${new Intl.NumberFormat('en-IN').format(parseInt(loc.discharged))}
                    `);
                    }
                })
                if (matchRegion != 1) {
                    bot.sendMessage(message.chat.id, `Not Found
Enter the name of state or ut properly`);
                }
            }
        })
    });



bot.onText(/\/yt/, (message, match) => { //ontext takes regex
    if (match.input === "/yt") {
        bot.sendMessage(message.chat.id, "No input")
    } else {
        const url = match.input.split(' ')[1];
        if (url.match(/v=(\w|-|_)+/g)) {
            var idOfVid = url.match(/v=(\w|-|_)+/g);
            idOfVid = idOfVid[0].slice(2);
            var titleOfVideo;
            var channelOfVideo;
            fetch(`${accessYoutubeApi}${idOfVid}`)
                .then(res => res.json())
                .then((data) => {
                    titleOfVideo = data.items[0].snippet.title;
                    channelOfVideo = data.items[0].snippet.channelTitle;
                    if (url != undefined) {
                        if (regex.test(url)) {
                            bot.sendMessage(message.chat.id, `${titleOfVideo}
${channelOfVideo}
Select the photo size :`, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{
                                                text: "120x90",
                                                callback_data: "default"
                                            },
                                            {
                                                text: "320x180",
                                                callback_data: "medium"
                                            },
                                            {
                                                text: "480x360",
                                                callback_data: "high"
                                            },
                                            {
                                                text: "640x480",
                                                callback_data: "standard"
                                            },
                                            {
                                                text: "1280x720",
                                                callback_data: "maxres"
                                            }
                                        ]
                                    ]
                                }
                            })

                            bot.on("callback_query", (callBackQuery) => {
                                var data = callBackQuery.data;
                                axios.get(`${accessYoutubeApi}${idOfVid}`)
                                    .then((api) => {
                                        var thumbnails = api.data.items[0].snippet.thumbnails
                                        bot.sendMessage(message.chat.id, "Wait for few seconds, may take some time");
                                        if (data == "default") {
                                            bot.sendPhoto(message.chat.id,thumbnails.default.url);
                                        } else if (data == "medium") {
                                            bot.sendPhoto(message.chat.id, thumbnails.medium.url)
                                        } else if (data == "high") {
                                            bot.sendPhoto(message.chat.id, thumbnails.high.url)
                                        } else if (data == 'standard') {
                                            bot.sendPhoto(message.chat.id, thumbnails.standard.url)
                                        } else if (data == 'maxres'){
                                            bot.sendPhoto(message.chat.id, thumbnails.maxres.url)
                                        }
                                    })
                            })
                        } else {
                            bot.sendMessage(message.chat.id, `Invalid URL
If you are providing the URL of youtube video make sure while pasting the URL before /yt don't write any character.
If you have provided the perfect url, please try again.`)
                        }
                    }
                })
        } else {
            bot.sendMessage(message.chat.id, 'Invalid URL')
        }
    }
})

//Error handing
bot.on("polling_error", (err) => console.log(err));

//https://www.googleapis.com/youtube/v3/search?q=hello&part=snippet&type=video&key=AIzaSyD3HahrJCN2LAuk8O8xHXbqXVuf4WP9j2g
//maxResults=10 can also be used
/* no. of members
bot.getChatMembersCount(message.chat.id)
.then((data)=>console.log(data))
*/