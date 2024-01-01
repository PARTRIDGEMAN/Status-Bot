import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import db from '../database.js'

export const pingCmd = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check the status of your server(s)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * 
     * @param {import('discord.js').ChatInputCommandInteraction} ctx
     * 
     */

    async run(ctx) {
        await ctx.deferReply({ ephemeral: true })

        const servers = await db.get(ctx.guildId).catch(() => [])

        if (!servers || servers.length === 0) {
            await ctx.editReply('There are currently no servers!')
            return
        }

        const statusEmbed = new Embed()
            .setTitle('Server Status')
            .setColor('#4EDA31')

        for (const server of servers) {
            const { host, port, name } = server
            const isUp = await ping(host, port).then(() => true).catch(() => false)
            const status = isUp ? 'Online' : 'Offline'
            const emoji = isUp ? ':green_circle:' : ':red_circle:'

            embed.addField(`${emoji} ${name}`, `Status: ${status}\nIP: ${host}:${port}`)
        }

        await ctx.editReply({ embeds: [statusEmbed] })
    }
}