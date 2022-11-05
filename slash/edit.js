module.exports = {
    name: 'edit',
    description: '🎉 Edit a giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway a éditer (message ID)',
            type: 'STRING',
            required: true
        },
        {
            name: 'duration',
            description: 'Heure de prise du giveaway mentionné. Par exemple 1h = une heure!',
            type: 'STRING',
            required: true
        },
        {
            name: 'winners',
            description: 'Combien de gagnants le giveaway devrait-il avoir',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'prize',
            description: 'Quel devrait être le prix du giveaway',
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
        const gid = interaction.options.getString('giveaway');
        const time = interaction.options.getString('duration');
        const winnersCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');

        await interaction.deferReply({
            ephemeral: true
        })
        try {
            await client.giveawaysManager.edit(gid, {
                newWinnersCount: winnersCount,
                newPrize: prize,
                addTime: time
            })
        } catch (e) {
            return interaction.editReply({
                content:
                    `Aucun cadeau trouvé avec le message ID: \`${gid}\``,
                ephemeral: true
            });
        }
        interaction.editReply({
            content:
                `Le giveaway a été edit!`,
            ephemeral: true
        });
    }

};
