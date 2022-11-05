const Discord = require("discord.js")
const messages = require("../utils/message");
const ms = require("ms")
module.exports = {
  name: 'start',
  description: '🎉 Start a giveaway',

  options: [
    {
      name: 'duration',
      description: 'Combien de temps le cadeau devrait durer. Exemples de valeurs: 1m, 1h, 1j',
      type: 'STRING',
      required: true
    },
    {
      name: 'winners',
      description: 'Combien de gagnants le cadeau devrait-il avoir',
      type: 'INTEGER',
      required: true
    },
    {
      name: 'prize',
      description: 'Quel devrait être le cadeau',
      type: 'STRING',
      required: true
    },
    {
      name: 'channel',
      description: 'Le salon pour commencer le giveaway.',
      type: 'CHANNEL',
      required: true
    },
    {
      name: 'bonusrole',
      description: 'Rôle qui recevrait des entrées bonus',
      type: 'ROLE',
      required: false
    },
    {
      name: 'bonusamount',
      description: 'Le nombre d\'entrées bonus que le rôle recevra',
      type: 'INTEGER',
      required: false
    },
    {
      name: 'invite',
      description: 'Invitation du serveur que vous souhaitez ajouter comme exigence.',
      type: 'STRING',
      required: false
    },
    {
      name: 'role',
      description: 'Rôle que vous souhaitez ajouter comme exigence.',
      type: 'ROLE',
      required: false
    },
  ],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has('ADMINISTRATOR') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Vous devez disposer des autorisations d\'administrateur pour lancer des giveaways.',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: ':x: Précise un salon textuel !',
        ephemeral: true
      });
    }
    if (isNaN(ms(giveawayDuration))) {
      return interaction.reply({
        content: ':x: Indique un temps valide!',
        ephemeral: true
      });
    }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Veuillez sélectionner un nombre de gagnants valide ! supérieur ou égal à un.',
      })
    }

    const bonusRole = interaction.options.getRole('bonusrole')
    const bonusEntries = interaction.options.getInteger('bonusamount')
    let rolereq = interaction.options.getRole('role')
    let invite = interaction.options.getString('invite')

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: Vous devez spécifier combien d'entrées bonus seraient ${bonusRole} recieve!`,
          ephemeral: true
        });
      }
    }


    await interaction.deferReply({ ephemeral: true })
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite)
      let client_is_in_server = client.guilds.cache.get(
        invitex.guild.id
      )
      reqinvite = invitex
      if (!client_is_in_server) {
        return interaction.editReply({
          embeds: [{
            color: "#2F3136",
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Server Check!",
            description:
              "Woah woah woah ! Je vois un nouveau serveur ! es-tu sûr que je suis dedans ? Vous devez m'inviter là-bas pour définir cela comme une exigence! 😳",
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "Server Check"
            }
          }]
        })
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**Réagis with 🎉 pour participé!**\n>>> - Seuls les membres ayant ${rolereq} sont autorisés à participer à ce giveaway!`
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**Réagis avec 🎉 pour participer !**\n>>> - Seuls les membres ayant ${rolereq} sont autorisés à participer à ce giveaway!\n- Les membres doivent obligatoirement rejoindre [ce serveur](${invite}) pour participer à ce giveaway!`
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**Réagis avec 🎉 pour participer !**\n>>> - Les membres doivent obligatoirement rejoindre [ce serveur](${invite}) pour participer à ce giveaway!`
    }


    client.giveawaysManager.start(giveawayChannel, {
      duration: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: parseInt(giveawayWinnerCount),
      bonusEntries: [
        {
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `Giveaway commencer dans ${giveawayChannel}!`,
      ephemeral: true
    })

    if (bonusRole) {
      let giveaway = new Discord.MessageEmbed()
        .setAuthor(`Bonus Entries Alert!`)
        .setDescription(
          `**${bonusRole}** à **${bonusEntries}** Entrées supplémentaires dans ce giveaway!`
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }

  }

};
