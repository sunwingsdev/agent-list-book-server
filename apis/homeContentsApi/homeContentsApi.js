const express = require("express");
const { ObjectId } = require("mongodb");

const homeContentsApi = (homeContentsCollection) => {
  const contentsRouter = express.Router();

  //   add home contents
  contentsRouter.post("/", async (req, res) => {
    const contentInfo = req.body;
    const filter = { option: contentInfo.option };
    const foundResult = await homeContentsCollection.findOne(filter);
    if (foundResult) {
      return res.status(404).send({ message: "Content already added" });
    }
    contentInfo.createdAt = new Date();
    const result = await homeContentsCollection.insertOne(contentInfo);
    res.send(result);
  });

  //   get all home contents
  contentsRouter.get("/", async (req, res) => {
    const result = await homeContentsCollection.find().toArray();
    res.send(result);
  });

  // edit a content
  contentsRouter.patch("/:id", async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }
    const filters = { _id: new ObjectId(id) };
    const contentInfo = req.body;
    contentInfo.modifiedAt = new Date();
    const updateDocument = {
      $set: contentInfo,
    };
    const result = await homeContentsCollection.updateOne(
      filters,
      updateDocument
    );
    res.send(result);
  });

  return contentsRouter;
};

module.exports = homeContentsApi;
