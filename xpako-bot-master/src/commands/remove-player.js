import { SlashCommandBuilder } from "@discordjs/builders";

import { remove_player } from "../utils/commands.js";

export default {
	data: new SlashCommandBuilder()
		.setName("remove-player")
		.setDescription(
			"Supprime un joueur de la liste des inscrits ( pas des pools par contre )"
		)
		.addStringOption((option) =>
			option
				.setName("id")
				.setDescription("Id discord du joueur en question")
				.setRequired(true)
		)
		.setDefaultPermission(false),

	execute: remove_player,
};
