const express = require("express");
const app = express();

const users = [
  { id: 1, name: "Siddhesh" },
  { id: 2, name: "user 2" },
  { id: 3, name: "user 3" },
  { id: 4, name: "user 4" },
  { id: 5, name: "user 5" },
  { id: 6, name: "user 6" },
  { id: 7, name: "user 7" },
  { id: 8, name: "user 8" },
  { id: 9, name: "user 9" },
  { id: 10, name: "user 10" },
];

const posts = [
  { id: 1, name: "Siddhesh's Post" },
  { id: 2, name: "post 2" },
  { id: 3, name: "post 3" },
  { id: 4, name: "post 4" },
  { id: 5, name: "post 5" },
  { id: 6, name: "post 6" },
  { id: 7, name: "post 7" },
  { id: 8, name: "post 8" },
  { id: 9, name: "post 9" },
  { id: 10, name: "post 10" },
];

app.get("/posts", paginatedResults(posts), (req, res) => {
  res.json(res.paginatedResults);
});
// we cant pass post as a parameter in middelware
// middleware should only accept req,res,next as parameters
// hence we have to return a function which will take this parameters as inputs

app.get("/users", paginatedResults(users), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(model) {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    results.results = model.slice(startIndex, endIndex);
    res.paginatedResults = results;

    // If ur are using mongodb models change above 2 lines to:
    // try {
    //   results.results = await model.find().limit(limit).skip(startIndex).exec()
    //   res.paginatedResults = results;
    // } catch {
    //   res.status(500).json({message:endIndex.message});
    // }
    next();
  };
}

app.listen(3000);
