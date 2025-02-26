import mongoose from "mongoose";
const { Schema } = mongoose;

const BookcarSchema = new Schema( {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car", 
    },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
      minlength: 13,
      maxlength: 13,
    },
    location: {
      type: String,
      required: true,
    },
    pickUpDate: {
      type: Date,
      required: true,
    },
    dropOffDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "in process", "completed"],
      default: "pending", 
    },
  },
  { timestamps: true })

const Bookcar = mongoose.model("Bookcar", BookcarSchema);
export default Bookcar;