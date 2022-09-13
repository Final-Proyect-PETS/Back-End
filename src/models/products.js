const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        price: {
            type: Number,
            require: true
        },
        image: [String],
        stock: {
            type: Number,
            default: 1
        },
        description: {
            type: String,
            require: true
        },
        place: {
            type: String,
            require: true
        },
        category: {
            type: String,
            enum: ["alimento", "servicio", "accesorio", "otro"],
            require: true,
            lowercase: true
        },
        type: {
            type: String,
            enum: ["perro", "gato", "otro"],
            require: true,
            lowercase: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        user: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    }
)
const Product = mongoose.model("Product", productSchema)

module.exports = Product