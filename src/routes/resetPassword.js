const { Router } = require("express");
const router = Router();
const User = require("../models/users")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")


router.patch("/resetpassword/:id/:auth", async (req, res, next) => {
    try {
        const userResetPassword = await User.findOne({ _id: req.params.id })
        const payload = jwt.verify(req.params.auth, process.env.SECRET_KEY)
        if (userResetPassword._id === req.params.id || payload.id) {
            const password = await bcrypt.hash(req.body.password, 10)
            await userResetPassword.update({ password: password })
            await userResetPassword.save()
            console.log("se cambio perro");
        }
        res.status(201).send({
            message: "Contraseña cambiada con exito"
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router