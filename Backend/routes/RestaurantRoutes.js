const express = require("express")
const { addrestaurant,getrestaurant, getRestaurantById } = require("../controllers/RestaurantController")
const router = express.Router()
const verifyToken = require("../Middleware/authmidddleware")


router.post("/add",verifyToken, addrestaurant)
router.get("/get",getrestaurant)
router.get("/:id",verifyToken,getRestaurantById)
module.exports = router