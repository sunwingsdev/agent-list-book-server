const express = require("express");

const homeContentsApi = (homeContentsCollection) => {
  const contentsRouter = express.Router();

  //   add home contents
  contentsRouter.post("/", async (req, res) => {
    const contentInfo = req.body;
    console.log(req.body);
    contentInfo.createdAt = new Date();
    const result = await homeContentsCollection.insertOne(contentInfo);
    res.send(result);
  });

  //   get all home contents
  contentsRouter.get("/", async (req, res) => {
    const result = await homeContentsCollection.find().toArray();
    res.send(result);
  });

  return contentsRouter;
};

module.exports = homeContentsApi;
