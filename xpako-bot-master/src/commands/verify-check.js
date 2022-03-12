import { SlashCommandBuilder } from "@discordjs/builders";
import { verify_check } from "../utils/commands.js";

export default {
	data: new SlashCommandBuilder()
		.setName("verify-check")
		.setDescription("Vérifie le checking")
		.setDefaultPermission(false),
	execute: async (interaction) => {
		try {
			const res = await verify_check();

			const body = await res.json();

			let content = `En cours de check-in ? ${body.on_check ? "Oui" : "Non"}`;

			body.player_list.forEach((element) => {
				content = content + "\n\n" + JSON.stringify(element);
			});

			await interaction.reply({
				content,
				fetchReply: true,
			});
		} catch (error) {
			const msg = `${error}`;

			interaction.reply(msg);
		}
	},
};
