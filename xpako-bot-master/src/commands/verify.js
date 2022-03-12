import { SlashCommandBuilder } from "@discordjs/builders";
import {
	get_command_options,
	get_infos,
	stringify_infos,
} from "../utils/commands.js";

export default {
	data: new SlashCommandBuilder()
		.setName("verify")
		.setDescription("Verifie la liste des inscrits")
		.setDefaultPermission(false)
		.addStringOption((option) =>
			option
				.setName("extends")
				.setDescription("Voir pools ou  ? 'pools' 'list' 'all' ")
				.setRequired(false)
		),
	execute: async (interaction) => {
		const options = get_command_options(interaction);

		const data = await get_infos();

		const content = stringify_infos(data, options[0]);

		await interaction.reply({
			content,
			fetchReply: true,
		});
	},
};
