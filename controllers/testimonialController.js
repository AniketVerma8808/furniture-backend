const testimonialModel = require("../models/testimonialModel");

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const testimonialData = {
      ...req.body,
      image: `${process.env.SERVER_URL}/uploads/${req.file.filename}`,
    };

    const newTestimonial = new testimonialModel(testimonialData);
    await newTestimonial.save();

    res
      .status(201)
      .json({ message: "Testimonial created successfully", newTestimonial });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ message: "Error creating testimonial", error });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Testimonials fetched successfully",
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials", error });
  }
};

// Delete a testimonial by ID
exports.deleteTestimonial = async (req, res) => {
  try {
    const deletedTestimonial = await testimonialModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting testimonial", error });
  }
};
