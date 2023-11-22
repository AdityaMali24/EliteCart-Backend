import express from "express";
import mongoose from "mongoose";    
import UserRouter from "./routers/user.router";
import categoryRouter from "./routers/category.router";
import subcategoryRouter from "./routers/subcategory.router";
import ProductRouter from "./routers/product.router";
import CartRouter from "./routers/cart.router";
import OrderRouter from "./routers/order.router";
import cors from "cors";


var app = express();

const PORT = process.env.PORT || 8006;

app.use(express.json())
app.use(express.static(__dirname))

app.listen(PORT, ()=>{
    console.log("Your server running on http://localhost:"+ PORT)
})


var corsOptions = {
    origin: ["*" ,"http://localhost:3000"],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions))

mongoose
.connect('mongodb://localhost:27017/projectDB')
.then(() => console.log('Connected!'));

app.use("/user", UserRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", subcategoryRouter);
app.use("/products", ProductRouter);
app.use("/cart", CartRouter);
app.use("/order", OrderRouter);


