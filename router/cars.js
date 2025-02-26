// backend/routes/carRoutes.js
import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Car from "../models/Cars.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Add Car
router.post("/cars", upload.single("image"), async (req, res) => {
  try {
    const { name, price, city, category, description , status } = req.body;

    // Upload image to Cloudinary
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "car-images",
      });
      imageUrl = result.secure_url;
    }

    // Save car details in MongoDB
    const newCar = new Car({ name, price, city, category, description, status,  image: imageUrl });
    await newCar.save();

    res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update Car
router.put("/cars/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, city, category, description, status } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    let imageUrl = car.image;

    // If a new image is uploaded, update it in Cloudinary
    if (req.file) {
      // Delete the old image from Cloudinary (if it exists)
      if (car.image) {
        const publicId = car.image.split("/").pop().split(".")[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(`car-images/${publicId}`);
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "car-images",
      });
      imageUrl = result.secure_url;
    }

    // Update car details in MongoDB
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { name, price, city, category, description, status, image: imageUrl },
      { new: true }
    );

    res.json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete Car
router.delete("/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Delete the image from Cloudinary (if it exists)
    if (car.image) {
      const publicId = car.image.split("/").pop().split(".")[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(`car-images/${publicId}`);
    }

    // Delete the car from MongoDB
    await Car.findByIdAndDelete(req.params.id);

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get All Cars
router.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/cars/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const car = await Car.findOne({
      $or: [{ _id: identifier }, { name: identifier }],
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;