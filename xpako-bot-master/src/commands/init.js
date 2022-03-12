import { SlashCommandBuilder } from "@discordjs/builders";
import fetch from "node-fetch";
import config from "../../config.js";

const { ip } = config;
export default {
	data: new SlashCommandBuilder()
		.setName("init")
		.setDescription("Démarre une session de tournoi")
		.setDefaultPermission(false)
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Nom de la session de tournoi")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("max_player")
				.setDescription(
					"Nombre de joueurs maximum dans le tournoi ? 8 16 32 64 "
				)
				.setRequired(true)
		),
	execute: async (interaction) => {
		const options = interaction.options._hoistedOptions;

		const init = {
			name: options[0].value,
			max_player: options[1].value,
		};

		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(init),
		};

		try {
			const res = await fetch(ip + "/tournament", requestOptions);
			const body = await res.json();

			const { max_amount } = body.data.player_list;

			const { tournament_name } = body.data;

			const content = `Tournoi "${tournament_name}" initialisé avec une capacité de ${max_amount} joueurs\nFaites /open pour ouvrir les inscriptions, /close pour les fermer`;

			interaction.reply({
				content,
				fetchReply: true,
			});
		} catch (error) {
			console.error(error);

			interaction.reply({
				content: "Erreur...",
				fetchReply: true,
			});
		}
	},
};
