const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {randomBytes} = require('crypto')
const {promisify} = require('util')

const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365
const cookieSettings = {
  httpOnly: true,
  maxAge: MS_IN_YEAR
}

const Mutation = {
  // TODO: check if they are logged in
  async createItem(parent, args, ctx, info) {
    return await ctx.db.mutation.createItem({
      data: {...args}
    }, info)
  },

  updateItem(parent, args, ctx, info) {
    const updates = {...args}
    delete updates.id
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {id: args.id},
    }, info)
  },

  async deleteItem(parent, args, ctx, info) {
    const where = {id: args.id}
    const item = await ctx.db.query.item({where}, `{id title}`)
    // TODO: check if they have permission
    return ctx.db.mutation.deleteItem({where}, info)
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase()
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { 
        ...args, 
        password,
        permissions: { set: ['USER'] }
      }
    }, info)

    // create JWT token and set it as cookie
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    ctx.response.cookie('token', token, cookieSettings)

    return user
  },

  async signin(parent, args, ctx, info) {
    const {email, password} = args
    
    // if there is user with this info
    const user = await ctx.db.query.user({ where: {email} })
    if (!user) throw new Error(`No user found for email ${email}`)
    
    // if password is correct
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Invalid email-password pair')
    
    // generate jwt
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    // set cookie
    ctx.response.cookie('token', token, cookieSettings)

    return user
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return {message: 'Good bye!'}
  },

  async requestReset(parent, args, ctx, info) {
    const {email} = args

    // check if real user
    const user = await ctx.db.query.user({ where: {email} })
    if (!user) throw new Error(`No user found for email ${email}`)

    // set a reset token and expiry
    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000
    const res = await ctx.db.mutation.updateUser({
      where: {email},
      data: {resetToken, resetTokenExpiry}
    })

    console.log({resetToken})
    // TODO: email them
    return {message: 'Okay!'}
  },

  async resetPassword(parent, args, ctx, info) {
    const {
      password, 
      confirmPassword,
      resetToken,
    } = args
    
    // check if passwords match
    if (password !== confirmPassword) {
      throw new Error('Passwords don\'t match')
    }

    // check if its a legit resetToken and not expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    })

    if (!user) throw new Error('Token is either invalid or expired')
    
    // has new password
    const passwordHash = await bcrypt.hash(password, 10)
    
    // save new password, remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {email: user.email},
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      }
    })

    // generate jwt
    const token = jwt.sign({userId: updatedUser.id}, process.env.APP_SECRET)

    // set as cookie
    ctx.response.cookie('token', token, cookieSettings)

    return updatedUser
  }
}

module.exports = Mutation