const cache = require("../Redis/cache.js"); // put that in main index.js file, to execute all function inside of that before any other steps
const { clearHash } = require("../Redis/cache.js");
const cleanCache = require("../Redis/middlewares/cleanCache.js");

app.get("/api/blogs/:id", requireLogin, async (req, res) => {
  const blog = await Blog.findOne({
    _user: req.user.id,
    _id: req.params.id,
  });

  res.send(blog);
});

app.get("/api/blogs", requireLogin, async (req, res) => {
  const blogs = await Blog.find({ _user: req.user.id }).cache({
    key: req.user.id, // add options to this cache method for nested/hashed collections
  }); // set this query as cache, then in cache.js in Query.prototype we check is it true;

  res.send(blogs);
});

app.post("/api/blogs", requireLogin, cleanCache, async (req, res) => {
  const { title, content } = req.body;

  const blog = new Blog({
    title,
    content,
    _user: req.user.id,
  });

  try {
    await blog.save();
    res.send(blog);
  } catch (err) {
    res.send(400, err);
  }

  // if don't use middleware like in 22 line, we can add cleaning function here:
  // clearHash(req.user.id); // after inserting new post, clear cached data by it's key
});
