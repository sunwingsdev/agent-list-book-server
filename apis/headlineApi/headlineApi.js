const express = require("express");
const { ObjectId } = require("mongodb");

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

  //   get the headline
  headlineRouter.get("/", async (req, res) => {
    const result = await headlineCollection.findOne();
    res.send(result);
  });

  // update the headline
  headlineRouter.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const headlineInfo = req.body;
    const query = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        title: headlineInfo?.title,
        headline: headlineInfo?.headline,
        modifiedAt: new Date(),
      },
    };
    const result = await headlineCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  return headlineRouter;
};

module.exports = headlineApi;
