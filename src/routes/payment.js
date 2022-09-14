const mercadopago = require("mercadopago");
const { Router } = require("express");
const verifyToken = require("../utils/middlewares/validateToken");
const router = Router();
const User = require("../models/users");
const Product = require("../models/products");
const axios = require("axios");
require("dotenv").config();

router.get("/:idDonor/:donationAmount", verifyToken, async (req, res, next) => {
  const { idDonor, donationAmount } = req.params;

  const id_orden = 1;

  // Agrega credenciales
  mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN,
  });

  try {
    const oneUser = await User.findOne({ _id: idDonor });
    let preference = {
      items: [
        {
          title: "Donación a Happy Tails",
          description: "",
          picture_url: "https://cdn-icons-png.flaticon.com/512/194/194279.png",
          category_id: "category123",
          quantity: 1,
          unit_price: Number(donationAmount),
        },
      ],
      external_reference: `${id_orden}`, //`${new Date().valueOf()}`,
      back_urls: {
        success: `https://happytails2.herokuapp.com/linkpayment/feedback/${idDonor}/${donationAmount}`,
        failure: `https://happytails2.herokuapp.com/linkpayment/feedback/${idDonor}/${donationAmount}`,
        pending: `https://happytails2.herokuapp.com/linkpayment/feedback/${idDonor}/${donationAmount}`,
      },
      payer: {
        name: oneUser.first_name,
        surname: oneUser.last_name,
        // email: oneUser.email,           // no olvidarse de descomentar este email, el de abajo esta hardcodeado
        email: "test_user_80969189@testuser.com",
      },
    };

    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        console.info("respondio");
        // Este valor reemplazará el string"<%= global.id %>" en tu HTML
        global.id = response.body.id;

        res.json({
          id: global.id,
          init_point: response.body.init_point,
        });
      })
      .catch(function (error) {
        next(error);
      });
  } catch (error) {
    next(error);
  }
});

router.get("/feedback/:idDonor/:donationAmount", async (req, res, next) => {
  const { payment_id } = req.query;
  const { idDonor } = req.params; //el donationAmount que traigo por params en esta ruta no lo estoy usando, pero si se lo saco, se rompe todo y no se por qué
  try {
    let donationDetail = await axios.get(
      `https://api.mercadopago.com/v1/payments/${payment_id}/?access_token=${process.env.ACCESS_TOKEN}`
    );
    const { date_approved, status, status_detail, transaction_amount } =
      donationDetail.data;
    if (status === "approved" && status_detail === "accredited") {
      const oneUser = await User.findOne({ _id: idDonor });
      oneUser.donations.push({
        paymentId: payment_id,
        date: date_approved,
        status: status,
        statusDetail: status_detail,
        donationAmount: transaction_amount,
      });
      await oneUser.save();
      return res.redirect("https://happytails.vercel.app/donationsuccessful");
    }
    if (status === "in_process" || status === "pending")
      return res.redirect("https://happytails.vercel.app/donationpending");
    if (status === "rejected")
      return res.redirect("https://happytails.vercel.app/donationcancelled");
  } catch (error) {
    next(error);
  }
});

///////////-------RUTA DE MARKETPLACE---------------------------------------------
router.get(
  "/market/:idBuyer/:productId/:quantity",
  verifyToken,
  async (req, res, next) => {
    const { idBuyer, productId, quantity } = req.params;

    const id_orden = 1;

    // Agrega credenciales//algo
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });

    try {
      const oneUser = await User.findOne({ _id: idBuyer });
      const product = await Product.findOne({ _id: productId });
      // console.log(product.image.flat(), "flat0");
      // console.log(product.image.flat(1), "flat1");
      // console.log(product.image.flat(2), "flat2");
      console.log( String(product.image[0]), "en 0 y string")
      // console.log(product.image[0].flat(), "flat en 0")
      let preference = {
        items: [
          {
            title: product.name,
            description: product.description,
            picture_url: String(product.image[0]),
            category_id: "category123", //ver que es
            quantity: Number(quantity),
            unit_price: Number(product.price),
          },
        ],

        external_reference: `${id_orden}`, //`${new Date().valueOf()}`,
        back_urls: {
          success: `https://happytails2.herokuapp.com/linkpayment/feedback2/${productId}/${quantity}`,
          failure: `https://happytails2.herokuapp.com/linkpayment/feedback2/${productId}/${quantity}`,
          pending: `https://happytails2.herokuapp.com/linkpayment/feedback2/${productId}/${quantity}`,
        },
        payer: {
          name: oneUser.first_name,
          surname: oneUser.last_name,
          // email: oneUser.email,           // no olvidarse de descomentar este email, el de abajo esta hardcodeado
          email: "test_user_80969189@testuser.com",
        },
      };
      mercadopago.preferences
        .create(preference)
        .then(function (response) {
          console.info("respondio");
          // Este valor reemplazará el string"<%= global.id %>" en tu HTML
          global.id = response.body.id;

          res.json({
            id: global.id,
            init_point: response.body.init_point,
          });
        })
        .catch(function (error) {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/feedback2/:productId/:quantity", async (req, res, next) => {
  const { payment_id } = req.query;
  const { productId, quantity } = req.params; //el productPrice que traigo por params en esta ruta no lo estoy usando, pero si se lo saco, se rompe todo y no se por qué
  try {
    let donationDetail = await axios.get(
      `https://api.mercadopago.com/v1/payments/${payment_id}/?access_token=${process.env.ACCESS_TOKEN}`
    );
    const { date_approved, status, status_detail, transaction_amount } =
      donationDetail.data;
    if (status === "approved" && status_detail === "accredited") {
      const product = await Product.find({ _id: productId });
      var stock = product.stock
      const producte = await Product.updateOne(
        { _id: productId },
        {
          $set: {
            stock: stock-quantity,
          },
        }
      );

      // await producte.save();
      return res.redirect("https://happytails.vercel.app/donationsuccessful");
    }
    if (status === "in_process" || status === "pending")
      return res.redirect("https://happytails.vercel.app/donationpending");
    if (status === "rejected")
      return res.redirect("https://happytails.vercel.app/donationcancelled");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
