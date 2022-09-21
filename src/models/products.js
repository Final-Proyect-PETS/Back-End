const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: [String],
        stock: {
            type: Number,
            default: 1
        },
        description: {
            type: String,
            required: true
        },
        place: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ["alimento", "servicio", "accesorio", "otro"],
            required: true,
            lowercase: true
        },
        type: {
            type: String,
            enum: ["perro", "gato", "otro"],
            required: true,
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
