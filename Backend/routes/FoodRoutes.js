const express = require("express")
const {getFoods, addFood,getFoodsByres,getFoodsById} = require("../controllers/FoodController")
const verifyToken = require("../Middleware/authmidddleware")
const router = express.Router()

router.get("/get", getFoods)
router.post("/add",verifyToken, addFood)
router.get("/get/byRestaurant/:resId",verifyToken,getFoodsByres)
router.get("/get/:id",getFoodsById)

module.exports = router