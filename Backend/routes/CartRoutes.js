const express = require("express")
const {getCarts,addCarts,updateCarts,deleteCarts,clearCarts} = require("../controllers/CartController")
const verifyToken = require("../Middleware/authmidddleware");
const router = express.Router()

router.get("/get/user",verifyToken,getCarts)
router.post("/add",verifyToken,addCarts)
router.put("/update",verifyToken,updateCarts)
router.delete("/delete",verifyToken,deleteCarts)
router.post("/clear",verifyToken, clearCarts);

module.exports = router