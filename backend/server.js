const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(morgan("dev"));

mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/trips",require("./routes/tripRoutes"));

app.get("/",(req,res)=>{
res.json({
message:"Travel Planner API Running"
});
});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
console.log(`Server running on ${PORT}`);
});