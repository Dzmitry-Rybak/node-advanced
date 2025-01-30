const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const keys = require("../config/keys.js");

const client = redis.createClient(keys.redisUrl);

client.hget = util.promisify(client.hget); // to avoid callback, now client.get will return Promise

const exec = mongoose.Query.prototype.exec;

// create a new method cache in Query prototype:
// to use it late in code, and mark does we need to cache this query or not
mongoose.Query.prototype.cache = function (options = {}) {
  this.userCache = true; // create new property in this with boolean, to mark as to cache this query
  this.hashKey = JSON.stringify(options.key || "");

  return this; // to continue chain
};

mongoose.Query.prototype.exec = async function () {
  if (!this.userCache) return exec.apply(this, arguments); // if there in query no .cache chain, just return plain data, without caching it

  // this - refer to the current query, that we'r trying to execute
  // example: somewhere in code we have Blogs.find({_user: req.user.id}) - in this case 'this' - query instance
  // and this.getQuery() - {_user: req.user.id}

  console.log("I'm ABOUT TO RUN A QUERY");

  console.log(this.getQuery());
  console.log(this.mongooseCollection.name); // to get the collection name - Blogs

  // key - join query + collection name, to create uniq key for caching
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // Steps for Redis:
  // 1. See if we have a value for 'key' in Redis
  const cacheValue = await client.hget(this.hashKey, key);

  // 2. If we do, return that
  if (cacheValue) {
    console.log(this); // return query that we executing
    // so before returning cached data, we need to parse it from string into js object.
    // but in fact, Mongoose expect to receive, not the plain object, but Mongoose Document.
    // so we need to do this trick

    const doc = JSON.parse(cacheValue);
    // the line above is like:
    /*
    new Blog({
    title: 'Some new Title'
    })
     */

    return Array.isArray(doc)
      ? doc.map((document) => new this.model(document)) // create new instance for each document from array
      : new this.model(doc); // create new instance for this model that is called.
  }

  // Otherwise, issue the query and store the result in Redis

  const result = await exec.apply(this, arguments); // execute original version of .exec
  client.hset(this.hashKey, key, JSON.stringify(result));
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey)); // cleat cached hash key
  },
};
