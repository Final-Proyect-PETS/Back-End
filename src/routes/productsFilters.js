const { Router } = require("express");
const { filtro } = require("../utils/controllers/productsFilters.js");
const verifyToken = require("../utils/middlewares/validateToken.js");
require("dotenv").config();
const router = Router();

router.get("/productsFilters", verifyToken, async (req, res, next) => {
  let {
    type,
    category,
    priceMin,
    priceMax,
  } = req.query;
  try {
    
      const filter = await filtro(
          type,
          category,
          priceMin,
          priceMax,
          );
          Number(priceMin)
          Number(priceMax)
          res.status(200).send(filter);
          console.log(priceMin, priceMax)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
