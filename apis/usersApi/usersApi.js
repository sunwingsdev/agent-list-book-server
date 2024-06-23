const express = require("express");

const usersApi = (usersCollection) => {
  const userRouter = express.Router();
  // add user
  userRouter.post("/", async (req, res) => {
    const userInfo = req.body;
    const foundResult = await usersCollection.findOne({ uid: userInfo.uid });
    if (foundResult) {
      return res.status(404).send({ message: "user already added" });
    }
    const result = await usersCollection.insertOne(userInfo);
    res.send(result);
  });

  return userRouter;
};

module.exports = usersApi;
