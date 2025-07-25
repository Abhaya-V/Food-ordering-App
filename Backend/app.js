const express = require("express")
const app = express()

require("dotenv").config()
require("./db/connection")


const cors = require("cors")
const userRoutes = require("./routes/UserRoutes")
const foodRoutes = require("./routes/FoodRoutes")
const cartRoutes = require("./routes/CartRoutes")
const orderRoutes = require("./routes/OrderRoutes")
const paymentRoutes = require("./routes/PaymentRoutes")
const resRoutes = require("./routes/RestaurantRoutes")
const categoryRoutes = require("./routes/CategoryRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const sellerRoutes =require("./routes/SellerRoutes")
const geocodeRoute =require("./utils/geocode")
const reviewRoutes = require("./routes/reviewRoutes");

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/restaurant',resRoutes)
app.use('/api/foods',foodRoutes)
app.use('/api/cart',cartRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/admin", adminRoutes);
app.use("/seller",sellerRoutes)
app.use("/api/geocode", geocodeRoute);
app.use("/api/reviews", reviewRoutes);


const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is listening to PORT ${PORT}`)
})