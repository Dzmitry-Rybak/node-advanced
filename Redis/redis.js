app.get("/api/blogs", requireLogin, async (req, res) => {
  const redis = require("redis");
  const redisUrl = "redis://127.0.0.1:6379";
  const client = redis.createClient(redisUrl);
  const util = require("util");

  client.get = util.promisify(client.get); // return Promise instead of returning callback

  // Do we have any cached data in redis related to this query
  const cachedBlogs = await client.get(req.user.id);

  // if Yes, then response to the request right away and return
  if (cachedBlogs) {
    // Serving from cache
    return res.send(JSON.parse(cachedBlogs));
  }

  // if No, we need to respond to request and update out cache to spore the data

  const blogs = await Blog.find({ _user: req.user.id });

  // Serving from MongoDB
  res.send(blogs);

  client.set(req.user.id, JSON.stringify(blogs));
});

client.set("color", "res", "EX", 5); // this cache will expire after 5 seconds
