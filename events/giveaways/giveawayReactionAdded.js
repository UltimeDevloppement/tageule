const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, reactor, messageReaction) {

    let client = messageReaction.message.client
    if (reactor.user.bot) return;
    if (giveaway.extraData) {
      if (giveaway.extraData.server !== "null") {
        try {
          await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
          return
        } catch (e) {
          messageReaction.users.remove(reactor.user);
          return
        }
      }
      if (giveaway.extraData.role !== "null" && !reactor.roles.cache.get(giveaway.extraData.role)) {
        messageReaction.users.remove(reactor.user);
        return
      }

  return
    }
  }
}
