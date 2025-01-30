const { clearHash } = require("../../Redis/cache.js");

module.exports = async (req, res, next) => {
  await next(); // awaiting our next sequent middleware
  // and only whet it'll be resolve, return to this middleware and invoke clearHash

  clearHash(req.user.id);
};
