import mongoose from "mongoose";
const { Schema } = mongoose;

const CarSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ["SUV", "Sedan", "Truck"], required: true },
    description: { type: String, required: true },
    image: { type: String }, // Image URL
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", CarSchema);
export default Car;