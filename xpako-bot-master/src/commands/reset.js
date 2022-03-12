import { SlashCommandBuilder } from "@discordjs/builders";
import fetch from "node-fetch";
import config from "../../config.js";

const { ip } = config;

export default {
	data: new SlashCommandBuilder()
		.setName("reset")
		.setDescription("Rénitialise la liste des joueurs inscrits")
		.setDefaultPermission(false),
	execute: async (interaction) => {
		await fetch(ip + "/tournament/reset");

		const content = "Tournoi rénitialisé";

		interaction.reply({
			content,
			fetchReply: true,
		});
	},
};
