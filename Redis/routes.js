const cache = require("../Redis/cache.js"); // put that in main index.js file, to execute all function inside of that before any other steps

app.get("/api/blogs/:id", requireLogin, async (req, res) => {
  const blog = await Blog.findOne({
    _user: req.user.id,
    _id: req.params.id,
  });

  res.send(blog);
});

app.get("/api/blogs", requireLogin, async (req, res) => {
  const blogs = await Blog.find({ _user: req.user.id }).cache(); // set this query as cache, then in cache.js in Query.prototype we check is it true;

  res.send(blogs);
});
