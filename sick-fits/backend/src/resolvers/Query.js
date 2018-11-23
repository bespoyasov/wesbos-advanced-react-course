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
}

module.exports = Query