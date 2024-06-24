const express = require("express");
const { ObjectId } = require("mongodb");

const usersApi = (usersCollection) => {
  const userRouter = express.Router();
  // add user
  userRouter.post("/", async (req, res) => {
    const userInfo = req.body;
    const foundResult = await usersCollection.findOne({ uid: userInfo.uid });
    if (foundResult) {
      return res.status(404).send({ message: "user already added" });
    }
    userInfo.createdAt = new Date();
    const result = await usersCollection.insertOne(userInfo);
    res.send(result);
  });

  // get all users
  userRouter.get("/", async (req, res) => {
    const result = await usersCollection.find().toArray();
    res.send(result);
  });

  // delete a user
  userRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  });

  return userRouter;
};

module.exports = usersApi;
