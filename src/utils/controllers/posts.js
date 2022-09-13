const Pets = require("../../models/pets");
const User = require("../../models/users");
const Product = require("../../models/products");
const connection = require("../../db");
require("dotenv").config();

const postPet = async (
  id,
  name,
  image,
  imagePool,
  type,
  description,
  size,
  age,
  vaccination,
  castrated,
  place,
  place_longitude,
  place_latitude,
  gender,
  interestedUsers
) => {
  try {
    connection();
  } catch (error) {
    console.error(error);
  }
  try {
    const foundUser = await User.findById({ _id: id });

    const newPet = new Pets({
      name,
      image,
      imagePool,
      type,
      description,
      size,
      age,
      vaccination,
      castrated,
      place,
      place_longitude,
      place_latitude,
      gender,
      interestedUsers,
      user: foundUser._id,
    });
    await newPet.save();
    foundUser.pets.push(newPet._id);
    await foundUser.save();
    return newPet;
  } catch (err) {
    console.error(err);
  }
};

const postProduct = async (id, name, price, image, stock, description, place, category, type, deleted) => {

  try {
    connection();
  } catch (error) {
    console.error(error);
  }
  try {
    const foundUser = await User.findOne({ _id: id })
    const newProduct = new Product({
      name,
      price,
      image,
      stock,
      description,
      place,
      category,
      type,
      deleted,
      user: foundUser._id
    })
    await newProduct.save()
    foundUser.products.push(newProduct._id)
    await foundUser.save()
    return newProduct
  } catch (error) {
    console.error(error)
  }

}

module.exports = { postPet, postProduct };
