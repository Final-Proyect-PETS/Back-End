const { Router } = require("express");
const router = Router();
const User = require("../models/users")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
require("dotenv").config()


router.post("/forgotpassword", async (req, res, next) => {
    if (req.body.email == "") {
        res.status(400).send({
            message: "El email es requerido"
        })
    }
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(403).send({
                message: "No existe ese email"
            })
        }
        let id = user._id;
        const token = jwt.sign({ id: id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.json({ error: null, data: { token }, id: { id } });
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "happytailshp@gmail.com",
                pass: `${process.env.NMAILER_PASSWORD2}`,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        let link = `https://happytails.vercel.app/587/resetpassword/${id}/${token}`
        let contentHTML = `
        
                     <h2>Hola!, ${user.first_name} ${user.last_name}. </h2> <br>
        Haga click en <a href=${link}>este link</a> para recuperar su contraseña <br>

          <img src = "https://cdn-icons-png.flaticon.com/512/194/194279.png" style="width:100px;"/> <br>


                                        Atentamente HT`;
        const mailOptions = {
            from: "'HappyTails'<happytailshp@gmail.com>",
            to: user.email,
            subject: "Recuperar contraseña",
            html: contentHTML,
        }
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error("Ha ocurrido un error", err);
            } else {
                console.log("Response", response);
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router