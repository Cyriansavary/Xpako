import { Client, Collection, Intents, MessageEmbed } from "discord.js";

import commands from "./commands/_commands.js";
import fetch from "node-fetch";
import config from "../config.js";
import { check_from_player, unregister } from "./utils/commands.js";
import { unregister_button } from "./utils/messages.js";

const { token, guildId, riot_api_key } = config;

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});

client.commands = new Collection();

const commandsList = commands.map((com) => {
	client.commands.set(com.data.name, com);

	return com.data.toJSON();
});

client.once("ready", async () => {
	console.log("Bot ready !");

	const guild = client.guilds.cache.get(guildId);

	const res = await guild.commands.set(commandsList);

	res.forEach(async (cmd) => {
		const permissions = [
			{
				id: "925133743071559751",
				type: "ROLE",
				permission: true,
			},
			{
				id: "396861921577533440",
				type: "ROLE",
				permission: true,
			},
		];

		await cmd.permissions.set({
			permissions,
		});
	});
	console.log("Permissions set !");
});

client.on("messageCreate", async (message) => {
	if (message.channelId === "924720650608861214") {
		const { username } = message.author;

		const discriminator = parseInt(message.author.discriminator, 10);
		const { id } = message.author;
		const league_name = message.content;

		try {
			const riot_res = await fetch(
				`https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${league_name}?api_key=${riot_api_key}`
			);

			if (riot_res.status !== 200) {
				throw "Pseudo TFT invalide";
			}

			const riot_player = await riot_res.json();

			const player = {
				league_name,
				discord_username: username,
				tag: discriminator,
				discord_id: id,
				riot_account_id: riot_player.accountId,
				puuid: riot_player.puuid,
			};

			const requestOptions = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(player),
			};
			const res = await fetch(
				"http://localhost:3024/tournament/inscriptions",
				requestOptions
			);

			if (res.status !== 200) {
				throw "Déjà inscrit";
			}

			const info = new MessageEmbed()
				.setTitle("Inscription validée !")
				.setColor("EB1EB5")
				.setDescription(
					"Si jamais tu n'as pas enregistré le bon pseudo ou que tu veux annuler ton inscription, appuie sur le bouton rouge juste en-dessous."
				)
				.addField("Pseudo LoL/TFT", league_name);

			const msg = {
				embeds: [info],
				components: [unregister_button],
			};

			await message.react("✅");
			message.author.send(msg);
		} catch (err) {
			let error;

			if (err === 1) {
				error = "Pseudo TFT invalide";
			} else if (err === 2) {
				error = "Tu es déjà inscrit";
			} else {
				console.log(err);
				error = "Erreur...";
			}

			const info = new MessageEmbed()
				.setTitle("Inscription impossible !")
				.setColor("EB1EB5")
				.setDescription(error);

			const msg = {
				embeds: [info],
			};
			await message.react("⛔");
			message.author.send(msg);
		}
	}
});

client.on("interactionCreate", async (interation) => {
	if (!interation.isCommand()) {
		return;
	}

	const command = client.commands.get(interation.commandName);

	if (!command) {
		return;
	}

	try {
		await command.execute(interation);
	} catch (error) {
		console.error(error);
		await interation.reply({ content: "Error", ephemeral: true });
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isButton()) {
		return;
	}

	const { customId } = interaction;

	if (customId === "row_0_button_3") {
		await unregister(interaction);
	} else if (customId === "yes_button") {
		const { id } = interaction.user;

		const res = await check_from_player(id);

		if (res.status !== 200) {
			interaction.reply("Erreur, contactez un admin");
		}

		interaction.reply("Votre participation est confirmée");
	} else if (customId === "no_button") {
		interaction.reply("Votre participation est annulée");
	}
});

client.login(token);
