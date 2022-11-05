const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.MessageEmbed()
          .setTitle(`🎁 Allons-y! Nous avons un nouveau gagnant`)
          .setColor("#2F3136")
          .setDescription(`Bonjour ${member.user}\n J'ai entendu dire que l'hôte a relancé et que vous avez gagné **[Ce Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Bien joué, tu as gagné : **${giveaway.prize}!**\n`)
          .setTimestamp()
          .setFooter(member.user.username, member.user.displayAvatarURL())
        ]
      }).catch(e => { })
    });
  }
}