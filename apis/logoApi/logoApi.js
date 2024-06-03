const express = require("express");
const { ObjectId } = require("mongodb");

const logoApi = (logosCollection) => {
  const logoRouter = express.Router();

  // add logo
  logoRouter.post("/", async (req, res) => {
    const logoInfo = req.body;
    console.log(logoInfo);
    logoInfo.createdAt = new Date();
    logoInfo.isSelected = false;
    const result = await logosCollection.insertOne(logoInfo);
    res.send(result);
  });

  //   get all logos
  logoRouter.get("/", async (req, res) => {
    const result = await logosCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  });

  //   update logo selection
  logoRouter.patch("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id format" });
      }
      const { isSelected } = req.body;
      const updateLogo = {
        $set: { isSelected: isSelected },
      };
      const filter = { _id: new ObjectId(id) };
      const result = await logosCollection.updateOne(filter, updateLogo);
      const updateOthersFilter = { _id: { $ne: new ObjectId(id) } };
      const updateOthers = {
        $set: { isSelected: false },
      };
      await logosCollection.updateMany(updateOthersFilter, updateOthers);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "An error occurred", error });
    }
  });

  //   delete a logo
  logoRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }
    const filter = { _id: new ObjectId(id) };
    const result = await logosCollection.deleteOne(filter);
    res.send(result);
  });

  return logoRouter;
};

module.exports = logoApi;
