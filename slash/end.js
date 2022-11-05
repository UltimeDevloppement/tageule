module.exports = {
    name: "end",
    description: '🎉 Mettre fin à un giveaway déjà en cours',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway a stoppé (message ID du giveaway)',
            type: 'STRING',
            required: true
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has('ADMINISTRATOR') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: :x: La permissions administrateur est requise !',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');
        const giveaway =
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        if (!giveaway) {
            return interaction.reply({
                content: 'Impossible de trouver un giveaway pour `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.reply({
                content: 'Le giveaway est déjà fini!',
                ephemeral: true
            });
        }

        client.giveawaysManager.end(giveaway.messageId)
            .then(() => {
                interaction.reply(`**[Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** a été fini!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};