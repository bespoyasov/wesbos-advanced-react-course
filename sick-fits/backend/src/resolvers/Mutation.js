const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {randomBytes} = require('crypto')
const {promisify} = require('util')
const {transport, makeNiceEmail} = require('../mail')
const {hasPermission} = require('../utils')

const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365
const cookieSettings = {
  httpOnly: true,
  maxAge: MS_IN_YEAR
}

const Mutation = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('You must be logged in')
    return await ctx.db.mutation.createItem({
      data: {
        // relationship to user in prisma:
        user: {
          connect: { id: ctx.request.userId }
        },
        ...args
      }
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
    const item = await ctx.db.query.item({where}, `{id title user {id}}`)
    
    // check if they have permission
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(permission => 
      ['ADMIN', 'ITEMDELETE'].includes(permission))
     
    if (!ownsItem && !hasPermissions) throw new Error('Not allowed')
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

    // email them
    // const mailResponse = await transport.sendMail({
    //   to: email,
    //   from: 'bespoyasov@me.com',
    //   subject: 'Password reset',
    //   html: makeNiceEmail(`Your password reset link: <a href='${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}'>click to reset</a>`)
    // })

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
  },

  async updatePermissions(parent, args, ctx, info) {
    const {userId} = ctx.request

    // if they are logged in
    if (!userId) throw new Error('You must be logged in')

    // query current user
    const currentUser = await ctx.db.query.user({
      where: {id: userId}
    }, info)

    // if they have permission to do that
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])

    return ctx.db.mutation.updateUser({
      // we can update someone else, not current
      where: { id: args.userId },
      // cause of enum
      data: {
        permissions: { set: args.permissions }
      },
    }, info)
  },

  async addToCart(parent, args, ctx, info) {
    const {userId} = ctx.request

    // if they are logged in
    if (!userId) throw new Error('You must be logged in')

    // query the users current cart
    // not cartItem cause CartItemWhereUniqueInput will get only ID
    // and we don't know it yet
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      }
    })

    // check if the item is in cart
    // add item or increment quantity
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      }, info)
    }

    return ctx.db.mutation.createCartItem({
      data: {
        user: {connect: {id: userId}},
        item: {connect: {id: args.id}},
      }
    }, info)
  },

  async removeFromCart(parent, args, ctx, info) {
    const {userId} = ctx.request

    const cartItem = await ctx.db.query.cartItem({
      where: { id: args.id }
    }, `{id, user { id }}`)

    if (!cartItem) throw new Error('No cart item found')
    if (cartItem.user.id !== userId) throw new Error('You don\'t own it')

    return ctx.db.mutation.deleteCartItem({
      where: { id: args.id }
    }, info)
  },
}

module.exports = Mutation