import { Socket } from 'node:net'

export const ping = (host, port, timeout = 5000) =>
	new Promise((resolve, reject) => {
		const socket = new Socket()

		socket.setTimeout(timeout)

		socket.connect(port, host, () => {
			socket.destroy()
			resolve()
		})

		socket.on('error', (e) => reject(e.message))

		socket.on('timeout', () => {
			socket.destroy()
			reject('Request Timeout')
		})
	})
