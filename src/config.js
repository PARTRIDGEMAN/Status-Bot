import 'dotenv/config'
import env from 'env-var'
import ms from 'ms'

/* Notice:
To configure the variables for the bot, you will need to create a file named '.env' within the project directory and define the variables within. 
Here is an example of the expected format for the contents of the '.env' file:

DISCORD_TOKEN=your-token-here

Make sure to replace 'your-token-here' with the actual token for your Discord bot.
*/

export default {
	token: env.get('DISCORD_TOKEN').required().asString(),
	port: env.get('PORT').default(8080).asPortNumber(),
	interval: ms('1 minute'), //e.g 5 minute, 2 minute, 30 second
	embeds: {
		downtime: {
			title: 'Server is down!', //keep the title short
			content: '<@&ROLE_ID>', // replace ROLE_ID with your ping role id
			description: 'Server {server_name} is down! We are Working to fix this!', //change to whatever you want it to be
			color: '#FF0000' //red by default
		},
		uptime: {
			title: 'Server is back!', //keep the title short
			content: '<@&ROLE_ID>', // replace ROLE_ID with your ping role id
			// Note: anything within "{}" is a dynamic value assigned by the code
			description: 'The server {server_name} was down for {time} of time',
			color: '#008000' //green by default
		}
	}
}
