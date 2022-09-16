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
        amount,
        logUser,
        numberT,
        link,
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
      <h1>Hola ${logUser}!</h1>
  <h2>El usuario <a href="${link}">${first_name} ${second_name}</a> compro ${thing}.
              El numero de transaccion es: ${numberT}</h2> 
              <ul>
              <li> Cantidad: ${amount}</li>
              <li> Ganancia: ${money}</li>
              </ul>
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
