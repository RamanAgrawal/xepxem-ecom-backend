import Product from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import cloudinary from 'cloudinary';

// const addProd = async (req, res) => {
//   const { name, price, description, category, subcategory } = req.body;
//   try {
//     if (!name || !price || !description || !category || !subcategory) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // const imageLocalPath = req.files?.avatar[0]?.path;
//     const imageLocalPath = req.file?.path;
//     console.log(imageLocalPath);

//     if (!imageLocalPath) {
//       return res.status(400).json({ error: "Please upload an avatar" });
//     }

//     const ProImage = await uploadOnCloudinary(imageLocalPath);
//     console.log(ProImage);

//     if (!ProImage) {
//       return res
//         .status(400)
//         .json({ error: "Failed to upload avatar to cloudinary" });
//     }
//     const product = await Product.create({
//       name,
//       price,
//       description,
//       category,
//       subcategory,
//       image: ProImage.url,
//     });
//     res.json({ result: product });
//   } catch (err) {
//     console.error("Error adding product:", err);
//     res.status(500).json({ error: "Failed to add product" });
//   }
// };

const addProd = async (req, res) => {
  const { name, price, description, category, subcategory } = req.body;
  try {
    // console.log("Received Data:", { name, price, description, category, subcategory });
    // console.log("Received File:", req.file);

    if (!name || !price || !description || !category || !subcategory) {
      console.log("Validation Error: Missing Fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    const imageLocalPath = req.file?.path;
    // console.log("Image Local Path: ", imageLocalPath);

    if (!imageLocalPath) {
      console.log("Validation Error: No Image");
      return res.status(400).json({ error: "Please upload an image" });
    }

    const ProImage = await uploadOnCloudinary(imageLocalPath);
    // console.log("Uploaded Image: ", ProImage);

    if (!ProImage) {
      console.log("Cloudinary Upload Error");
      return res.status(400).json({ error: "Failed to upload image to cloudinary" });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      subcategory,
      image: ProImage.url,
    });
    res.json({ result: product });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};



const getProd = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ result: products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const editProd = async (req, res) => {
  const { name, price, description, category, subcategory } = req.body;
  const updateData = { name, price, description, category, subcategory };

  try {
    // Check if a new image is being uploaded
    if (req.file) {
      const imageLocalPath = req.file.path;
      // console.log("Image Local Path: ", imageLocalPath);

      // Upload the new image to Cloudinary
      const ProImage = await uploadOnCloudinary(imageLocalPath);
      // console.log("Uploaded Image: ", ProImage);

      if (!ProImage) {
        console.log("Cloudinary Upload Error");
        return res.status(400).json({ error: "Failed to upload image to Cloudinary" });
      }

      // Update the product's image URL
      updateData.image = ProImage.url;
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ result: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};



const deleteProd = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ result: deletedProduct });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export { addProd, getProd, editProd, deleteProd };
