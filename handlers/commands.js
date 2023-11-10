const fs = require('fs');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest')
const AsciiTable = require('ascii-table');
const { token } = require('../config');
const table = new AsciiTable().setHeading('Slash Commands(OK)', 'Stats').setBorder('|', '=', "0", "0")

const rest = new REST().setToken(token);


module.exports = (client, message) => {
	const slashCommands = []; 

	fs.readdirSync('./commands/').forEach(async dir => {
		const files = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

		for(const file of files) {
				const slashCommand = require(`../commands/${dir}/${file}`);
				slashCommands.push({
					name: slashCommand.name,
					description: slashCommand.description,
					type: slashCommand.type,
					options: slashCommand.options ? slashCommand.options : null,
					default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
					default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
				});
			
				if(slashCommand.name) {
						client.slashCommands.set(slashCommand.name, slashCommand)
						table.addRow(file.split('.js')[0], '✅')
				} else {
						table.addRow(file.split('.js')[0], '⛔')
				}
		}
		
	});
	console.log(table.toString());

	(async () => {
			try {
				await rest.put(

					Routes.applicationCommands("1109572843785683044"), 
					{ body: slashCommands }
				);
				console.log('Slash Commands • Registered')
			} catch (error) {
				console.log(error);
			}
	})();
};

