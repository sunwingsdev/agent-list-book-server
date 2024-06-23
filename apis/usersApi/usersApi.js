const express = require("express");

const usersApi = (usersCollection) => {
  const userRouter = express.Router();
  // add user
  userRouter.post("/", async (req, res) => {
    const userInfo = req.body;
    // const foundResult=await usersCollection.findOne({})
  });

  return userRouter;
};

module.exports = usersApi;
