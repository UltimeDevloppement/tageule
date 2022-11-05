const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.MessageEmbed()
          .setTitle(`🎁 Félicitations !`)
          .setColor("#2F3136")
          .setDescription(`Bonjour ${member.user},\n Tu viens de gagner **[[Ce Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Tu as gagné : **${giveaway.prize}!**\n`)
          .setTimestamp()
          .setFooter(member.user.username, member.user.displayAvatarURL())
        ]
      }).catch(e => { })
    });

  }
}