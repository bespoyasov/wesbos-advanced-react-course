const {forwardTo} = require('prisma-binding')

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
}

module.exports = Query