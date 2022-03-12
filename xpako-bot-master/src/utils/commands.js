import fetch from "node-fetch";
import config from "../../config.js";

const { ip, ip_round_check } = config;
const header_print = () => {
	return "\n============================================================\n Pseudo discord ▶ Pseudo Ing\n============================================================\n";
};

const get_player_print = (player) =>
	`${player.discord_name.name}#${player.discord_name.tag} ▶ ${player.league_name}\n`;

const openInscriptions = async (interaction, content, open) => {
	const action = {
		open,
	};

	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(action),
	};

	try {
		const res = await fetch(
			ip + "/tournament/inscriptions/status",
			requestOptions
		);

		if (res.status !== 200) {
			throw "Erreur...";
		}

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
};

const generate_pools_string = (data) => {
	const { pool_list } = data.tournament;

	const plist = pool_list.map((pool) => {
		const player_list = pool.player_list.map(get_player_print);

		const list = player_list.join("\n");

		return list;
	});

	const temp_fmt_list = plist.join(
		"\n---------------------------------------------\n"
	);

	const len = temp_fmt_list.length;

	if (len === 0) {
		return "Aucun joueurs inscrits pour générer les pools";
	}

	let s = "```\n" + header_print() + temp_fmt_list + "\n```";

	const fmt_list = "Liste des pools générées" + s;

	return fmt_list;
};

const get_all_pprints = (pstr_list) => {
	return header_print().concat(pstr_list.join(""));
};

const generate_plist_string = (data) => {
	const { list } = data.player_list;

	const fmt_list = get_all_pprints(
		list
			.filter((player) => player.discord_id !== "2n+1")

			.map(get_player_print)
	);

	const len = fmt_list.length;

	if (len === 0) {
		return "Aucun joueurs inscrits pour générer les pools";
	}

	const final_fmt_list =
		"Liste des joueurs inscrits" + "```\n" + fmt_list + "\n```";

	return final_fmt_list;
};

const resolvePlayerList = (data) => {
	if (!data.player_list) {
		return { max_amount: 0, current_amount: 0 };
	} else {
		return data.player_list;
	}
};

const get_infos = async () => {
	const res = await fetch(ip + "/info");

	const body = await res.json();

	const { data } = body;

	return data;
};

const stringify_infos = (data, option) => {
	const player_list = resolvePlayerList(data);

	const is_pools_generated = data.tournament;
	const is_plist = data.player_list;

	const content = `Pools randoms générées: ${
		is_pools_generated ? "Oui" : "Non"
	}\nNom du tournoi: ${data.tournament_name}\nInscriptions ouvertes: ${
		data.open ? "Oui" : "Non"
	}\nCapacité du tournoi: ${player_list.max_amount}\nJoueurs inscrits: ${
		player_list.current_amount
	}`;

	if (is_pools_generated && option === "pools") {
		const pools = generate_pools_string(data);
		return content.concat(`\n\n${pools}`);
	} else if (is_plist && option === "list") {
		const plist = generate_plist_string(data);
		return content.concat(`\n\n${plist}`);
	} else if (is_pools_generated && is_plist && option === "all") {
		const pools = generate_pools_string(data);
		const plist = generate_plist_string(data);
		return content.concat(`\n\n${pools}\n\n${plist}`);
	}

	return content;
};

const get_command_options = (interaction) => {
	const options = interaction.options._hoistedOptions;

	return options.map((element) => element.value);
};

const unregister = async (interaction) => {
	const { user } = interaction;

	const { username } = user;

	const discriminator = parseInt(user.discriminator, 10);
	const { id } = user;
	const league_name = "xxx";

	const player = {
		league_name,
		discord_username: username,
		tag: discriminator,
		discord_id: id,
		riot_account_id: "xxx",
		puuid: "xxx",
	};

	const requestOptions = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(player),
	};

	try {
		const res = await fetch(ip + "/tournament/inscriptions", requestOptions);

		if (res.status !== 200) {
			throw "Invalid input";
		}

		interaction.reply("Votre inscription est annulée");
	} catch (err) {
		interaction.reply("Vous n'êtes pas inscrit");
	}
};
const remove_player = async (interaction) => {
	const options = interaction.options._hoistedOptions;

	const username = "xxx";
	const discriminator = 0;

	const id = options[0].value;
	const league_name = "xxx";

	const player = {
		league_name,
		discord_username: username,
		tag: discriminator,
		discord_id: id,
		riot_account_id: "xxx",
		puuid: "xxx",
	};

	const requestOptions = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(player),
	};

	try {
		const res = await fetch(ip + "/tournament/inscriptions", requestOptions);

		if (res.status !== 200) {
			throw "Invalid input";
		}

		interaction.reply("Joueur supprimé des inscrits");
	} catch (err) {
		console.error(err);
		interaction.reply("Joueur pas inscrit");
	}
};

const start_round_check = async (time) => {
	const res = await fetch(`${ip_round_check}/start/${time}`);

	const body = await res.json();

	return body;
};

const check_from_player = async (id) => {
	const res = await fetch(`${ip_round_check}/check/${id}`);

	return res;
};

const verify_check = async () => {
	const res = await fetch(`${ip_round_check}/info`);

	return res;
};

export {
	openInscriptions,
	generate_pools_string,
	resolvePlayerList,
	get_infos,
	stringify_infos,
	get_command_options,
	unregister,
	remove_player,
	start_round_check,
	check_from_player,
	verify_check,
};
