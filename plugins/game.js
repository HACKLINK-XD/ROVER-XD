const { delay } = require("@whiskeysockets/baileys");
const { cmd } = require("../command");

// Squid Game Command
cmd({
  pattern: "squidgame",
  desc: "Start the Squid Game in a group",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { isAdmin, isOwner, participants, reply }) => {
  try {
    if (!m.isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmin && !isOwner) return reply("❌ Only admins can use this command.");

    let groupMembers = participants.filter(p => !p.admin);
    if (groupMembers.length < 5) return reply("⚠️ At least 5 non-admin members are required to play.");

    let gameCreator = "@" + m.sender.split("@")[0];

    let gameMessage = `🔴 *Squid Game: Red Light,🟢Green Light*\n\n🎭 *Front Man*: (${gameCreator})\n`;
    gameMessage += groupMembers.map(m => "@" + m.id.split("@")[0]).join("\n") + "\n\n";
    gameMessage += "All other group members are added as players! The game starts in 50 seconds.";

    await conn.sendMessage(m.chat, { text: gameMessage, mentions: groupMembers.map(m => m.id) });

    await delay(50000);

    let players = groupMembers.sort(() => 0.5 - Math.random()).slice(0, 5);
    let playersList = players.map((p, i) => `${i + 1}. @${p.id.split("@")[0]}`).join("\n");

    await conn.sendMessage(m.chat, {
      text: `🎮 *Player List:*\n${playersList}\n\n🔔 The game starts now!`,
      mentions: players.map(p => p.id)
    });

    await delay(3000);

    let rulesMessage = `📜 *Squid Game Rules:*\n\n`
      + `1️⃣ During 🟥 *Red Light*, players who send a message will be *eliminated* and *removed* from the group.\n\n`
      + `2️⃣ During 🟩 *Green Light*, players must send a message. Those who remain silent will be eliminated.\n\n`
      + `3️⃣ The game ends when only one player remains.\n\n`
      + `🏆 Survive to become the *winner*!`;

    await conn.sendMessage(m.chat, { text: rulesMessage });

    await delay(5000);

    let remainingPlayers = [...players];
    while (remainingPlayers.length > 1) {
      let isGreenLight = Math.random() > 0.5;
      let lightMessage = isGreenLight ? "🟩 *Green Light*" : "🟥 *Red Light*";
      await conn.sendMessage(m.chat, { text: `🔔 ${lightMessage}` });

      await delay(5000);

      let playersToKick = [];
      let spokenPlayers = new Set();

      conn.ev.on("messages.upsert", (msg) => {
        let sender = msg.messages[0].key.remoteJid;
        if (remainingPlayers.find(p => p.id === sender)) spokenPlayers.add(sender);
      });

      if (isGreenLight) {
        for (let player of remainingPlayers) {
          if (!spokenPlayers.has(player.id)) {
            playersToKick.push(player);
          }
        }
      } else {
        for (let player of remainingPlayers) {
          if (spokenPlayers.has(player.id)) {
            playersToKick.push(player);
          }
        }
      }

      for (let player of playersToKick) {
        await conn.groupParticipantsUpdate(m.chat, [player.id], "remove");
        let eliminationMessage = isGreenLight
          ? `❌ @${player.id.split("@")[0]} stayed silent during 🟩 *Green Light* and was eliminated and removed.`
          : `❌ @${player.id.split("@")[0]} spoke during 🟥 *Red Light* and was eliminated and removed.`;

        await conn.sendMessage(m.chat, {
          text: eliminationMessage,
          mentions: [player.id]
        });
      }

      remainingPlayers = remainingPlayers.filter(p => !playersToKick.includes(p));
    }

    if (remainingPlayers.length === 1) {
      await conn.sendMessage(m.chat, {
        text: `🏆 *Congratulations @${remainingPlayers[0].id.split("@")[0]}!*\nYou survived and won the Squid Game! 🎉`,
        mentions: [remainingPlayers[0].id]
      });
    }
  } catch (error) {
    console.error("Error in .squidgame command:", error);
    reply("❌ An error occurred while starting the Squid Game.");
  }
});

// Konami Match Command
cmd({
  pattern: "konami",
  desc: "Simulate a match between two teams and randomly choose a winner after 30 seconds.",
  category: "game",
  react: "⚽",
  filename: __filename,
  use: ".konami"
}, async (conn, mek, m, { from, sender, reply }) => {
  try {
    const teams = [
      "Real Madrid 🇪🇸", "FC Barcelona 🇪🇸", "Manchester United 🇬🇧", "Liverpool FC 🇬🇧",
      "Bayern Munich 🇩🇪", "Juventus 🇮🇹", "Paris Saint-Germain 🇫🇷", "Arsenal FC 🇬🇧",
      "AC Milan 🇮🇹", "Inter Milan 🇮🇹", "Chelsea FC 🇬🇧", "Borussia Dortmund 🇩🇪",
      "Cameroon 🇨🇲", "Ivory Coast 🇨🇮", "Tottenham Hotspur 🇬🇧", "Senegal 🇸🇳",
      "DR Congo 🇨🇩", "Congo 🇨🇬", "Ajax Amsterdam 🇳🇱", "FC Porto 🇵🇹",
      "SL Benfica 🇵🇹", "Olympique Lyonnais 🇫🇷", "Olympique Marseille 🇫🇷", "AS Monaco 🇫🇷",
      "Sporting CP 🇵🇹", "Everton FC 🇬🇧", "West Ham United 🇬🇧", "Atletico Madrid 🇪🇸",
      "AS Roma 🇮🇹", "Fiorentina 🇮🇹", "Napoli 🇮🇹", "Celtic FC 🇬🇧",
      "Rangers FC 🇬🇧", "Feyenoord 🇳🇱", "PSV Eindhoven 🇳🇱", "Brazil 🇧🇷",
      "Germany 🇩🇪", "Argentina 🇦🇷", "France 🇫🇷", "Spain 🇪🇸",
      "Italy 🇮🇹", "England 🏴", "Portugal 🇵🇹", "Netherlands 🇳🇱",
      "Belgium 🇧🇪", "Mexico 🇲🇽", "Uruguay 🇺🇾", "USA 🇺🇸"
    ];

    const team1 = teams[Math.floor(Math.random() * teams.length)];
    let team2 = teams[Math.floor(Math.random() * teams.length)];
    while (team2 === team1) {
      team2 = teams[Math.floor(Math.random() * teams.length)];
    }

    const announcement = `⚽ *Match Versus*\n\n${team1} 🆚 ${team2}\n\n@${sender.split("@")[0]}, choose the winner! You have 30 seconds to decide.`;
    await reply(announcement, { mentions: [sender] });

    await new Promise(resolve => setTimeout(resolve, 30000));

    const chosenTeam = Math.random() < 0.5 ? team1 : team2;
    const resultMessage = `🏆 *Match Result*\n\nThe winner is: ${chosenTeam} 🥳\n\n> Here’s your result 😎 @${sender.split("@")[0]}!`;
    await reply(resultMessage, { mentions: [sender] });
  } catch (error) {
    console.error("Error in konami command:", error);
    reply("❌ An error occurred while running the konami command.");
  }
});
