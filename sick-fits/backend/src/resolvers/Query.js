const {forwardTo} = require('prisma-binding')
const {hasPermission} = require('../utils')

const Query = {
  items: forwardTo('db'),
  // the same as:
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items()
  //   return items
  // }

  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),

  self(parent, args, ctx, info) {
    const {userId} = ctx.request
    if (!userId) return null
    
    return ctx.db.query.user({
      where: {id: userId}
    }, info)
  },

  async users(parent, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) throw new Error('Please log in')

    // check if the user has permission to query users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])

    // query all the users
    return ctx.db.query.users({}, info)
  },

  async order(parent, args, ctx, info) {
    const {userId, user} = ctx.request
    // check if they are logged in
    if (!userId) throw new Error('Please log in')

    // query current order
    const order = await ctx.db.query.order({
      where: {id: args.id}
    }, info)

    // if they have the permission to see it
    const ownsOrder = order.user.id === userId
    const hasPermissionToSeeOrder = user.permissions.includes('ADMIN')
    if (!ownsOrder || !hasPermissionToSeeOrder) throw new Error('no-no-no!')

    return order
  },
}

module.exports = Query