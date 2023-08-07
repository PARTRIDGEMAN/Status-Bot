import db from '../database.js'
import { setTimeout as sleep } from 'node:timers/promises'
import config from '../config.js'
import { ping } from '../util.js'
import ms from 'ms'
import { EmbedBuilder } from 'discord.js'

const timeout = ms('5 seconds')

/**
 *
 * @param {import('discord.js').Client} client
 */
export const ready = async (client) => {
	console.log('Connected to Discord API')
	console.log(client.user.tag)

	const commands = [...client.commands.values()].map((it) => it.data.setDMPermission(false))

	await client.application.commands.set(commands)

	// const spawn = (task) => task().catch((e) => console.error(e))

	while (true) {
		for (const guild of client.guilds.cache.values()) {
			const servers = (await db.get(guild.id).catch(() => null)) || []

			for (const server of servers) {
				const alertChannel = guild.channels.cache.get(server.channelId)
				const id = server.host + server.port
				const isUP = await ping(server.host, server.port, timeout)
					.then(() => true)
					.catch(() => false)

				console.log(server.host + ':' + server.port, 'is', isUP ? 'UP' : 'DOWN')

				const embed = new EmbedBuilder().setTimestamp()
				let content = null

				if (isUP) {
					const lastSeenDown = await db.get(id).catch(() => null)

					await db.delete(id).catch(() => null)

					embed.setTitle(config.embeds.uptime.title).setColor(config.embeds.uptime.color)
					content = config.embeds.uptime.content

					if (lastSeenDown) {
						const downTime = ms(Math.abs(Date.now() - lastSeenDown), { long: true })
						embed.setDescription(
							config.embeds.uptime.description.replace(/{server_name}/g, server.name).replace(/{time}/g, downTime)
						)
					} else {
						continue
					}
				} else {
					const isAlerted = await db.get(id).catch(() => null)

					if (!isAlerted) {
						await db.set(id, Date.now())

						content = config.embeds.downtime.content
						embed
							.setTitle(config.embeds.downtime.title)
							.setDescription(config.embeds.downtime.description.replace(/{server_name}/g, server.name))
							.setColor(config.embeds.downtime.color)
					}
				}

				await alertChannel
					?.send({
						content,
						embeds: [embed]
					})
					.catch((e) => console.error(`Couldn't send alert message:`, e))
			}
		}

		await sleep(config.interval)
	}
}
