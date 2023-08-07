import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import db from '../database.js'

export const removeHostCmd = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Removes a server')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((i) => i.setName('name').setDescription('Server name').setRequired(true)),

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} ctx
	 */
	async run(ctx) {
		await ctx.deferReply()
		const name = ctx.options.getChannel('name', true)

		let found = null

		await db.pull(ctx.guildId, (it) => {
			if (it.name.toLowerCase() === name.toLowerCase()) {
				found = it
				return true
			}
			return false
		})

		if (found) {
			await ctx.editReply(`**${found.name}** has been successfully removed.`)
		} else {
			await ctx.editReply(`Couldn't find any server.`)
		}
	}
}
