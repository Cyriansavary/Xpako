import { SlashCommandBuilder } from "@discordjs/builders";

import { unregister } from "../utils/commands.js";

export default {
	data: new SlashCommandBuilder()
		.setName("unregister")
		.setDescription("Annule votre inscription")
		.setDefaultPermission(true),
	execute: unregister,
};
