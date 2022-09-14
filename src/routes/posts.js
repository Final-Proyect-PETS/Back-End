const { Router } = require("express");
const { postPet, postProduct } = require("../utils/controllers/posts");
const verifyToken = require("../utils/middlewares/validateToken");
require("dotenv").config();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const router = Router();

router.post("/pets/:id", verifyToken, async (req, res, next) => {
  const _id = req.params.id;
  const {
    name,
    image,
    imagePool,
    type,
    description,
    size,
    age,
    vaccination,
    castrated,
    place,
    place_longitude,
    place_latitude,
    gender,
  } = req.body;
  try {
    const newPet = postPet(
      _id,
      name,
      image,
      imagePool,
      type,
      description,
      size,
      age,
      vaccination,
      castrated,
      place,
      place_longitude,
      place_latitude,
      gender
    );
    res.status(201).send(newPet);
  } catch (error) {
    next(error);
  }
});

router.post("/images", upload.single("file"), async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.status(201).json(result.secure_url);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/product/:id", verifyToken, async (req, res, next) => {
  const _id = req.params.id
  const { name, price, image, stock, description, place, category, type } = req.body
  try {
    const newProduct = postProduct(
      _id,
      name,
      price,
      image,
      stock,
      description,
      place,
      category,
      type
    )
    res.status(201).send(newProduct)
  } catch (error) {
    next(error)
  }

})

module.exports = router;
