const Products = require("../../models/products");
const connection = require("../../db");
require("dotenv").config();

async function filtro(
    type,
    category,
    priceMin,
    priceMax,
) {
  connection();
  try {
      let all = await Products.find({ deleted: false }).populate({
          path: "user",
          match: { deleted: false },
        });
     if (!priceMin && !priceMax){
        all = all;
     }
     if (priceMin > 0 && !priceMax){
        all = all.filter((ev) => ev.price >= priceMin)
     }
     if (priceMax > 0 && !priceMin){
        all = all.filter((ev) => ev.price <= priceMax)
     }
     if (priceMin > 0 && priceMax > 0){
        all = all.filter((ev) => ev.price >= priceMin && ev.price <= priceMax)
     }
    
    if (type === "gato") {
      all = all.filter((ev) => ev.type === "gato");
    }
    if (type === "perro") {
      all = all.filter((ev) => ev.type === "perro");
    }
    if (type === "otro") {
      all = all.filter((ev) => ev.type === "otro");
    }
    if (category === "alimento") {
      all = all.filter((ev) => ev.category === "alimento");
    }
    if (category === "servicio") {
      all = all.filter((ev) => ev.category === "servicio");
    }
    if (category === "accesorio") {
      all = all.filter((ev) => ev.category === "accesorio");
    }
    if (category === "otro") {
      all = all.filter((ev) => ev.category === "otro");
    }
    return all;
  } catch (error) {
    console.error(error);
  }
}
module.exports = { filtro };