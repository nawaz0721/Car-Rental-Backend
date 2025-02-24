import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, },
    cnic: { type: String, unique: true, },
    password: { type: String, required: true, },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
}, { timestamps: true })

const User = mongoose.model("Users", UserSchema);
export default User;