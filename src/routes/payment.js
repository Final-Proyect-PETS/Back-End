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
      return res.redirect("https://happytails.vercel.app/donations");
    }
    if (status === "in_process" || status === "pending")
      return res.redirect("https://happytails.vercel.app/donations");
    if (status === "rejected")
      return res.redirect("https://happytails.vercel.app/donations");
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
    const oneUser = await User.findOne({ _id: idBuyer });
    const product = await Product.findOne({ _id: productId });
    const image = product.image[0];
    console.log(image)
    console.log(product.stock)
    console.log(quantity)
    if (product.stock > quantity) {
      try {
        let preference = {
          items: [
            {
              title: product.name,
              description: product.description,
              picture_url: image, //no llega nunca a donde va pic_url
              category_id: "category123", //ver que es
              quantity: Number(quantity),
              unit_price: Number(300),
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
    } else {
      res.status(418).json({ error: "Stock insuficiente" })
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
      const product = await Product.findOne({ _id: productId }).populate({
        path: "user",
        match: { deleted: false },
      });

      let stock = product.stock - quantity;

      await Product.updateOne(
        { _id: productId },
        {
          $set: {
            stock: stock,
          },
        }
      );

      return res.redirect("https://happytails.vercel.app/purcheasesuccessful");
    }
    if (status === "in_process" || status === "pending")
      return res.redirect("https://happytails.vercel.app/purcheasepending");
    if (status === "rejected")
      return res.redirect("https://happytails.vercel.app/purcheasecancelled");
  } catch (error) {
    next(error);
  }
});

//----CARRITO---------------------------------------------------------------------------------------------------

///idUSer/OTroid
router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    console.log(req.params);
    console.log(req.body);
    const { products } = req.body;
    const id_orden = 1;
    console.log(req.params.id, "IDBUYER CAMPEON");
    console.log(products, "PRODUCTOS LLEGADOS DE CARRITO");

    // // Agrega credenciales//algo
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id", verifyToken, async (req, res, next) => {
  try {
    console.log(req.params);
    const { products } = req.body;
    const id_orden = 1;
    console.log(req.params.id, "IDBUYER CAMPEON");
    console.log(req.body, "PRODUCTOS LLEGADOS DE CARRITO");

    // // Agrega credenciales//algo
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN,
    });
  } catch (error) {
    next(error);
  }
  try {
    const id_orden = 1;
    const oneUser = await User.findOne({ _id: req.params.id });
    let product = req.body;
    let productPrice = product.map((e) => e.product.price * e.quantity);
    let productTotal = productPrice.reduce((prev, curr) => prev + curr, 0);
    let preference = {
      items: [
        {
          title: "Carrito",
          description: "Hola",
          picture_url: "image", //no llega nunca a donde va pic_url
          category_id: "category123", //ver que es
          quantity: Number(1),
          unit_price: Number(productTotal),
        },
      ],

      external_reference: `${id_orden}`, //`${new Date().valueOf()}`,
      back_urls: {
        success: `https://happytails2.herokuapp.com/linkpayment/feedback3`,
        failure: `https://happytails2.herokuapp.com/linkpayment/feedback3`,
        pending: `https://happytails2.herokuapp.com/linkpayment/feedback3`,
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

router.get("/feedback3", verifyToken, async (req, res, next) => {
  //   const { payment_id } = req.query;
  //   const { productId, quantity } = req.params; //el productPrice que traigo por params en esta ruta no lo estoy usando, pero si se lo saco, se rompe todo y no se por qué
  try {
    let donationDetail = await axios.get(
      `https://api.mercadopago.com/v1/payments/${payment_id}/?access_token=${process.env.ACCESS_TOKEN}`
    );
    const { date_approved, status, status_detail, transaction_amount } =
      donationDetail.data;
    if (status === "approved" && status_detail === "accredited") {
      //       const product = await Product.findOne({ _id: productId }).populate({
      //         path: "user",
      //         match: { deleted: false },
      //       });

      //       let stock = product.stock - quantity;

      //       await Product.updateOne(
      //         { _id: productId },
      //         {
      //           $set: {
      //             stock: stock,
      //           },
      //         }
      //       );

      return res.redirect("https://happytails.vercel.app/purcheasesuccessful");
    }
    if (status === "in_process" || status === "pending")
      return res.redirect("https://happytails.vercel.app/purcheasepending");
    if (status === "rejected")
      return res.redirect("https://happytails.vercel.app/purcheasecancelled");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
