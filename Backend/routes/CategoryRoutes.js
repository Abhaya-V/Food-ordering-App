const express = require("express");
const router = express.Router();
const { getCategories, addCategory } = require("../controllers/categoryController");
const verifySeller = require("../Middleware/verifySeller")

router.get("/get", getCategories);
router.post("/add",verifySeller, addCategory);

module.exports = router;
