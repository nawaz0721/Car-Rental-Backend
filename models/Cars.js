import mongoose from "mongoose";
const { Schema } = mongoose;

const CarSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    city: {type: String, required: true },
    category: { type: String, enum: ["SUV", "Sedan", "Sport", "Van", "Truck" ], required: true },
    description: { type: String, required: true },
    image: { type: String }, 
    status: { type: String, enum: ["available", "rented"], default: "available"}
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", CarSchema);
export default Car;