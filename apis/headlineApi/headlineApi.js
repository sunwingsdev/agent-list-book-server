const express = require("express");

const headlineApi = (headlineCollection) => {
  const headlineRouter = express.Router();

  //   add headline
  headlineRouter.post("/", async (req, res) => {
    const headlineInfo = req.body;
    headlineInfo.createdAt = new Date();
    const foundResult = await headlineCollection.find().toArray();
    if (foundResult.length !== 0) {
      res.status(404).send({ message: "Headline already added" });
    }
    const result = await headlineCollection.insertOne(headlineInfo);
    res.send(result);
  });

  //   get the
  headlineRouter.get("/", async (req, res) => {
    const result = await headlineCollection.findOne();
    res.send(result);
  });

  return headlineRouter;
};

module.exports = headlineApi;
