import { ChannelType, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import db from '../database.js'

export const pingCmd = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add a server')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((i) => i.setName('name').setDescription('Server name').setRequired(true)) // Server name to brodcast when a server goes down.
		.addStringOption((i) => i.setName('host').setDescription('Server hostname/IP').setRequired(true)) // Do not put a domain e.g play.example.com instead put the ip e.g 127.0.0.1
		.addIntegerOption((i) =>
			i.setName('port').setDescription('Server port').setRequired(true).setMinValue(0).setMaxValue(65535)
		)
		.addChannelOption((i) =>
			i
				.setName('channel')
				.setDescription('Set alerts channel')
				.addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
				.setRequired(true)
		),

	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} ctx
	 * 
	 */
	
	async run(ctx) {
		await ctx.deferReply({ ephemeral: true })

		const name = ctx.options.getString('name', true)
		const host = ctx.options.getString('host', true)
		const port = ctx.options.getInteger('port', true)
		const channel = ctx.options.getChannel('channel')

		// To avoid duplication
		await db.pull(ctx.guildId, (it) => it.host === host && it.port === port)
		await db.push(ctx.guildId, { name, host, port, channelId: channel?.id || null })

		await ctx.editReply(`**${name}** has been added successfully!`)
	}
}
