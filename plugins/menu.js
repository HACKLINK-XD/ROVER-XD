const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "menu the bot",
    category: "menu",
    react: "🍓",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        let dec = `
╭───「 🤖 *${config.BOT_NAME}* - v${config.VERSION || '1.0.0'} 」
│ 👤 Owner: ${config.OWNER_NAME || 'Unknown'}
│ 📡 Uptime: ${runtime(process.uptime())}
╰─────────────────────────────

╭─❏ *GENERAL*
║ ➤ .menu
║ ➤ .help
║ ➤ .alive
║ ➤ .ping
║ ➤ .owner
║ ➤ .quote
║ ➤ .fact
║ ➤ .weather
║ ➤ .news
║ ➤ .lyrics

╭─❏ *GROUP*
║ ➤ .groupinfo
║ ➤ .admins
║ ➤ .jid
║ ➤ .promote
║ ➤ .demote
║ ➤ .kick
║ ➤ .del
║ ➤ .tag
║ ➤ .tagall
║ ➤ .welcome
║ ➤ .goodbye
║ ➤ .mute
║ ➤ .unmute
║ ➤ .resetlink

╭─❏ *MODERATION*
║ ➤ .warn
║ ➤ .warnings
║ ➤ .clear
║ ➤ .antilink
║ ➤ .antibadword
║ ➤ .antidelete
║ ➤ .clearsession
║ ➤ .cleartmp

╭─❏ *AI / GPT*
║ ➤ .gpt
║ ➤ .gemini
║ ➤ .chatbot

╭─❏ *AUDIO & TOOLS*
║ ➤ .tts <text>
║ ➤ .ss
║ ➤ .simage
║ ➤ .setpp
║ ➤ .autoreact
║ ➤ .autostatus
║ ➤ .mode

╭─❏ *STICKERS & EFFECTS*
║ ➤ .sticker
║ ➤ .tgsticke
║ ➤ .take
║ ➤ .emojimix
║ ➤ .blur

╭─❏ *IMAGE GEN*
║ ➤ .imagine
║ ➤ .flux
║ ➤ .metallic
║ ➤ .ice
║ ➤ .snow
║ ➤ .impressive
║ ➤ .matrix
║ ➤ .light
║ ➤ .neon
║ ➤ .devil
║ ➤ .purple
║ ➤ .thunder
║ ➤ .leaves
║ ➤ .1917
║ ➤ .arena
║ ➤ .hacker
║ ➤ .sand
║ ➤ .blackpink
║ ➤ .glitch
║ ➤ .fire

╭─❏ *DOWNLOADER*
║ ➤ .play
║ ➤ .song
║ ➤ .ytmp4
║ ➤ .tiktok
║ ➤ .video
║ ➤ .instagram
║ ➤ .facebook

╭─❏ *GAMES & FUN*
║ ➤ .tictactoe
║ ➤ .hangman
║ ➤ .guess
║ ➤ .trivia
║ ➤ .answer
║ ➤ .truth
║ ➤ .dare
║ ➤ .meme

╭─❏ *DEVELOPER*
║ ➤ .git
║ ➤ .github
║ ➤ .script
║ ➤ .repo
║ ➤ .sc

╰───「 Powered by *${config.BOT_NAME}* 」
`;

        await conn.sendMessage(
            from,
            {
                video: { url: config.ALIVE_IMG },
                caption: dec,
                gifPlayback: true,
                mimetype: 'video/mp4',
                contextInfo: {
                    mentionedJid: [sender]
                }
            },
            { quoted: mek }
        );

        const audioUrls = [
            'https://files.catbox.moe/nf8ska.mp3',
            'https://files.catbox.moe/zy1vib.mp3',
            'https://files.catbox.moe/ckaofd.mp3',
            'https://files.catbox.moe/rqgr2c.mp3',
            'https://files.catbox.moe/lf0xs9.mp3',
            'https://files.catbox.moe/0ougu9.mp3',
            'https://files.catbox.moe/q4arm4.mp3',
            'https://files.catbox.moe/dybznq.mp3',
            'https://files.catbox.moe/6v918j.mp3',
            'https://files.catbox.moe/4ld703.mp3',
            'https://files.catbox.moe/p0bdyk.mp3',
            'https://files.catbox.moe/x9omvz.mp3',
            'https://files.catbox.moe/ulh93p.mp3'
        ];

        const audioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];

        await conn.sendMessage(
            from,
            {
                audio: { url: audioUrl },
                mimetype: 'audio/mp4',
                ptt: true
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});
