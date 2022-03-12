import { SlashCommandBuilder } from "@discordjs/builders";
import { openInscriptions } from "../utils/commands.js";

export default {
	data: new SlashCommandBuilder()
		.setName("close")
		.setDescription("Ferme les inscriptions pour le tournoi")
		.setDefaultPermission(false),
	execute: async (interaction) => {
		const content = "Inscriptions fermées, /open pour les ouvrir";

		openInscriptions(interaction, content, false);
	},
};
