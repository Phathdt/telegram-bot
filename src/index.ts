import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { Api, TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

const apiId = parseInt(process.env.API_ID || '0')
const apiHash = process.env.API_HASH || ''
const botToken = process.env.BOT_TOKEN || ''

const stringSession = new StringSession('')
const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
})

;(async () => {
  await client.start({
    botAuthToken: botToken,
  })

  console.log('You should now be connected.')

  console.log(client.session.save())
})()

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'pong' })
})

app.get('/users', async (req: Request, res: Response) => {
  const username = String(req.query.username)

  try {
    const result = await client.invoke(
      new Api.users.GetFullUser({
        id: username,
      })
    )

    res.json({ msg: result })
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
