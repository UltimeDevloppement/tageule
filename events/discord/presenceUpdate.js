const Discord = require("discord.js")
const config = require("../../config.json")
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Presence} oldPresence 
 * @param {Discord.Presence} newPresence 
 */
module.exports = (client, oldPresence, newPresence) => {
    if (newPresence.activities[0]) {
        if (newPresence.activities[0].state === null) return;
        if (newPresence.activities[0].state.match(config.statut)) {
            const guild = client.guilds.cache.get(config.serveurid)
            if (guild) {
                const role = guild.roles.cache.get(config.role_status)
                if (role) {
                    const member = guild.members.cache.get(newPresence.user.id)
                    if (member) {
                        member.roles.add(role)
                    }
                }
            }
        } else {
            const guild = client.guilds.cache.get(config.serveurid)
            if (guild) {
                const role = guild.roles.cache.get(config.role_status)
                if (role) {
                    const member = guild.members.cache.get(newPresence.user.id)
                    if (member) {
                        member.roles.remove(role)
                    }
                }
            }
        }
    }
}