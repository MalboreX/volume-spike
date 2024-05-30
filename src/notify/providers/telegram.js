const axios = require('axios');

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

class Telegram {
    async sendNotify(text) {
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${text}`;
        try {
            await axios.get(url);
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports.Telegram = Telegram;