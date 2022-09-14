const { Router } = require("express");
const {
  getPets,
  getUsers,
  userId,
  petId,
  getProduct,
  getProductId,
  sendNotification,
} = require("../utils/controllers/gets.js");
const verifyToken = require("../utils/middlewares/validateToken");

const router = Router();

router.get("/pets", verifyToken, async (req, res, next) => {
  try {
    const pets = await getPets(req.query.name);
    res.status(200).send(pets.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const users = await getUsers(req.query.name);
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
});

router.get("/users/:id", verifyToken, async (req, res, next) => {
  try {
    const user = await userId(req.params.id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

router.get("/pets/:id", verifyToken, async (req, res, next) => {
  try {
    const pet = await petId(req.params.id);
    res.status(200).send(pet);
  } catch (err) {
    next(err);
  }
});

router.get("/products", verifyToken, async (req, res, next) => {
  try {
    const product = await getProduct(req.query.name)
    res.status(200).send(product)
  } catch (error) {
    next(error)
  }
})

router.get("/products/:id", verifyToken, async (req, res, next) => {
  try {
    const productId = await getProductId(req.params.id)
    res.status(200).send(productId)
  } catch (error) {
    next(error)
  }
})
module.exports = router;
