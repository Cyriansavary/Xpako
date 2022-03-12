import { SlashCommandBuilder } from "@discordjs/builders";
import fetch from "node-fetch";
import config from "../../config.js";

const { ip } = config;
export default {
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("Charge la liste des joueurs inscrits")
		.setDefaultPermission(false),
	execute: async (interaction) => {
		const content = "Chargement des joueurs inscrits effectuée";

		try {
			const res = await fetch(ip + "/reload");

			if (res.status !== 200) {
				throw "Error...";
			}
			interaction.reply(content);
		} catch (error) {
			interaction.reply("Error...");
		}
	},
};
