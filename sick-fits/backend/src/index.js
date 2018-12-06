const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

require('dotenv').config({path: 'variables.env'})
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()
server.express.use(cookieParser())

// decode jwt
server.express.use((req, res, next) => {
  const {token} = req.cookies
  if (!token) return next()

  const {userId} = jwt.verify(token, process.env.APP_SECRET)
  req.userId = userId
  return next()
})

// populates user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next()

  const user = await db.query.user(
    {where: {id: req.userId}}, 
    '{id, permissions, email, name}')

  req.user = user
  return next()
})

server.start({
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }
}, deets => {
  console.log(`Server running on port ${deets.port}`)
})

// heroku: 
// https://dashboard.heroku.com/apps/bespoy-wesbos-course-yoga-prod/settings