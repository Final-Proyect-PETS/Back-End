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
            service: "gmail",
            auth: {
                user: "happytailshp@gmail.com",
                pass: `${NMAILER_PASSWORD2}`,
            },
        })
        const emailPort = 587
        const mailOptions = {
            from: "'HappyTails'<happytailshp@gmail.com>",
            to: `${user.email}`,
            subject: "Recuperar contraseña en Happy Tails",
            text: `https://happytails.vercel.app/${emailPort}/resetpassword/${id}/${token}`
        }
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error("Ha ocurrido un error", err);
            } else {
                console.error("Response", response);
                res.status(200).json("El email para la reucperacion ha sido enviado")
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router