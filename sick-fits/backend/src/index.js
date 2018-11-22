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

  const {iserId} = jwt.verify(token, process.env.APP_SECRET)
  req.userId = userId
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