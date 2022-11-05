module.exports = (client, interaction) => {
  if (interaction.isCommand()) {

    const command = client.interactions.get(interaction.commandName);

    if (!command) return interaction.reply({
      content: "La commande n'est probalement pas enregistrée !",
      ephemeral: true
    });

    command.run(client, interaction);
  }
}