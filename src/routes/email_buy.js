const { Router } = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const router = Router();
const { NMAILER_PASSWORD2 } = process.env;

router.post("/sendEmailBuy", async (req, res) => {
  try {

      const {
        money,
        first_name,
        second_name,
        logUser,
        thing,
        logUserEmail,
      } = req.body;

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "happytailshp@gmail.com",
          pass: `${NMAILER_PASSWORD2}`,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      let contentHTML = `
      <img src = "https://cdn-icons-png.flaticon.com/512/194/194279.png" style="width:100px;"/>
      <h1>Hola ${logUser.uername}!</h1>
  <h2>El usuario <a href="https://happytails.vercel.app/users/${logUser._id}">${first_name} ${second_name}</a> compro ${thing}.
              <h1> Ganancia: ${money}</h1>
                        <p>Te deseamos un buen dia!</p>
                              Atentamente HT`;




      let info = await transporter.sendMail({
        from: "'HappyTails'<happytailshp@gmail.com>",
        to: logUserEmail,
        subject: "Notificacion de venta",
        html: contentHTML,
      });

      console.log("message sent", info.messageId);
      res.send("OK");
    }
   catch (error) {
    next(error);
  }});
module.exports = router;