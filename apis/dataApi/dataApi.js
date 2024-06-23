const express = require("express");
const { ObjectId } = require("mongodb");

const dataApi = (dataCollection) => {
  const dataRouter = express.Router();

  //   add data
  dataRouter.post("/", async (req, res) => {
    const dataInfo = req.body;
    dataInfo.createdAt = new Date();
    const foundResult = await dataCollection
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    const lastId = foundResult[0].id;
    console.log(lastId);
    if (!lastId) {
      dataInfo.id = 100001;
    } else {
      dataInfo.id = lastId + 1;
    }
    const result = await dataCollection.insertOne(dataInfo);
    res.send(result);
  });

  //   get all data
  dataRouter.get("/", async (req, res) => {
    const result = await dataCollection.find().toArray();
    res.send(result);
  });

  dataRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await dataCollection.deleteOne(query);
    res.send(result);
  });

  dataRouter.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const dataInfo = req.body;
    const query = { _id: new ObjectId(id) };
    const updatedDoc = { $set: dataInfo };
    const result = await dataCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  return dataRouter;
};

module.exports = dataApi;
