const next = require("next");

const app = next({
  dev: process.env.NODE_ENV !== "production",
});

const routes = require("./routes");
const handler = routes.getRequestHandler(app);

const express = require("express");
app.prepare().then(() => {
  express()
    .use(handler)
    .listen(3000, (err) => {
      if (err) throw err;
      console.log("Ready on localhost:3000");
    });
});
