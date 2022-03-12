const unregister_embed = {
	color: "EB1EB5",
	title: "Si tu ne pourras pas être présent, clique sur ce bouton",
};
const round_check_embed = {
	color: "EB1EB5",
	title: "Est ce que tu confirmes ta présence ?",
};

const unregister_button = {
	style: 4,
	label: `Annuler mon inscription`,
	custom_id: `row_0_button_3`,
	disabled: false,
	type: 2,
};

const yes_button = {
	style: 3,
	label: `Oui`,
	custom_id: `yes_button`,
	disabled: false,
	type: 2,
};
const no_button = {
	style: 4,
	label: `Non`,
	custom_id: `no_button`,
	disabled: false,
	type: 2,
};

const message_1 = {
	header: {
		content:
			"Hello,\n\nJe t'envoie ce message pour te rappeler **ton inscription à notre tournoi hebdomadaire !**\nIl aura lieu demain soir sur notre serveur discord : https://discord.gg/SkMSdyTFjd\n\nMerci d'avance de ta réponse, et good luck !",
	},
	footer: {
		content: "\u200b",
		embeds: [unregister_embed],
		components: [
			{
				type: 1,
				components: [unregister_button],
			},
		],
	},
};

const round_check_message = (time) => {
	const min = time / 60;

	const message = {
		content: `Hello,\n\nMerci de confirmer ta présence pour le tournoi TFT, tu as **${min}min pour cliquer** sur le bouton vert en bas, sinon tu seras retiré de la liste des participants.\n\nA tout de suite !\u200b`,
		embeds: [round_check_embed],
		components: [
			{
				type: 1,
				components: [yes_button, no_button],
			},
		],
	};

	return message;
};

export { unregister_button, message_1, round_check_message };
