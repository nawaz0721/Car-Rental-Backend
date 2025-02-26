// backend/routes/bookcarRoutes.js
import express from "express";
import Bookcar from "../models/Bookcar.js";
import Car from "../models/Cars.js";

const router = express.Router();

router.post("/bookCar", async (req, res) => {
    try {
      const { carTitle, name, mobile, nic, location, pickUpDate, dropOffDate, totalDays, totalPrice } = req.body;
  
      // Car ka ObjectId find karein `carTitle` ke basis pe
      const car = await Car.findOne({ name: carTitle });
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
  
      // Booking ka object create karein
      const booking = new Bookcar({
        car: car._id, // Store Car ObjectId instead of carTitle
        name,
        mobile,
        nic,
        location,
        pickUpDate,
        dropOffDate,
        totalDays,
        totalPrice
      });
  
      console.log("Booking Data:", booking);
      await booking.save();
  
      res.status(201).json(booking);
    } catch (error) {
      console.error("Booking Error:", error);
      res.status(500).json({ message: "Booking failed", error });
    }
  });

// Get all bookings (GET)
router.get("/getBookings", async (req, res) => {
  try {
    const bookings = await Bookcar.find(); // Sare bookings fetch karein
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

// Update booking status (PUT)
router.put("/updateBooking/:id", async (req, res) => {
  try {
    const updatedBooking = await Bookcar.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a booking (DELETE)
router.delete("/bookcar/:id", async (req, res) => {
  try {
    await Bookcar.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
