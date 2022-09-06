const { Router } = require("express");
const verifyToken = require("../utils/middlewares/validateToken");
const petReport = require("../models/petReports");
const userReport = require("../models/userReports");
const User = require("../models/users");
const Pets = require("../models/pets");
const router = Router();

router.patch("/pet", async (req, res, next) => {
  try {
    const { id, ban } = req.body;
    const onePet = await Pets.findOne({ _id: id });
    onePet.deleted = ban;
    await onePet.save();
    const arrayPets = await Pets.find({ deleted: false }).populate({
      path: "user",
      match: { deleted: false },
    });
    ban //OJO: ver si desde el front llega como booleano o como string
      ? res
          .status(201)
          .json(arrayPets.sort((a, b) => b.createdAt - a.createdAt))
      : res
          .status(201)
          .json(arrayPets.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
});

router.patch("/user", async (req, res, next) => {
  try {
    const { id, ban } = req.body;
    const oneUser = await User.findOne({ _id: id });
    oneUser.deleted = ban;
    await oneUser.save();
    const arrayUsers = await User.find({ deleted: false });
    ban //OJO: ver si desde el front llega como booleano o como string
      ? res.status(201).json(arrayUsers)
      : res.status(201).json(arrayUsers);
  } catch (error) {
    next(error);
  }
});

router.patch("/petreport", async (req, res, next) => {
  try {
    const { id, resolved } = req.body;
    const onePetReport = await petReport.findOne({ _id: id });
    onePetReport.deleted = resolved;
    await onePetReport.save();
    const arrayReportedPets = await petReport.find({ deleted: false });
    resolved //OJO: ver si desde el front llega como booleano o como string
      ? res.status(201).json(arrayReportedPets)
      : res.status(201).json(arrayReportedPets);
  } catch (error) {
    next(error);
  }
});

router.patch("/userreport", async (req, res, next) => {
  try {
    const { id, resolved } = req.body;
    const oneUserReport = await userReport.findOne({ _id: id });
    oneUserReport.deleted = resolved;
    await oneUserReport.save();
    const arrayReportedUsers = await userReport.find({ deleted: false });
    resolved //OJO: ver si desde el front llega como booleano o como string
      ? res.status(201).json(arrayReportedUsers)
      : res.status(201).json(arrayReportedUsers); //REVER
  } catch (error) {
    next(error);
  }
});

router.patch("/admin", async (req, res, next) => {
  try {
    const { id, isAdmin } = req.body;
    const oneUser = await User.findOne({ _id: id });
    oneUser.isAdmin = isAdmin;
    await oneUser.save();
    isAdmin //OJO: ver si desde el front llega como booleano o como string
      ? res.status(201).send("Usuario ascendido a administrador")
      : res.status(201).send("Administrador descendido a usuario");
  } catch (error) {
    next(error);
  }
});

router.get("/deletedpets", async (req, res, next) => {
  try {
    const arrayDeletedPets = await Pets.find({ deleted: true });
    res.status(201).json(arrayDeletedPets);
  } catch (error) {
    next(error);
  }
});

router.get("/deletedusers", async (req, res, next) => {
  try {
    const arrayDeletedUsers = await User.find({ deleted: true });
    res.status(201).json(arrayDeletedUsers);
  } catch (error) {
    next(error);
  }
});

router.patch("/deleteduser", async (req, res, next) => {
  try {
    const { id, ban } = req.body;
    const oneUser = await User.findOne({ _id: id });
    oneUser.deleted = ban;
    await oneUser.save();
    const arrayUsers = await User.find({ deleted: true });
    ban //OJO: ver si desde el front llega como booleano o como string
      ? res.status(201).json(arrayUsers)
      : res.status(201).json(arrayUsers);
  } catch (error) {
    next(error);
  }
});

router.get("/userreports", async (req, res, next) => {
  try {
    const arrayDeletedUserReports = await userReport.find({ deleted: true });
    res.status(201).json(arrayDeletedUserReports);
  } catch (error) {
    next(error);
  }
});

router.patch("/userreported", async (req, res, next) => {
  try {
    const { id, resolved } = req.body;
    const oneUserReport = await userReport.findOne({ _id: id });
    oneUserReport.deleted = resolved;
    await oneUserReport.save();
    const arrayReportedUsers = await userReport.find({ deleted: true });
    resolved //OJO: ver si desde el front llega como booleano o como string
      ? res.status(201).json(arrayReportedUsers)
      : res.status(201).json(arrayReportedUsers); //REVER
  } catch (error) {
    next(error);
  }
});

module.exports = router;
