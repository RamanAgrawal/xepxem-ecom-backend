
import Product from "../models/product.model.js";


const search = async (req, res) => {
    try {
        const {keyword} = req.params

        // Check if keyword is provided
        if (!keyword) {
            return res.status(400).json({ error: "Keyword is required" });
        }
        const results = await Product.find({
        
            $or : [
                { name: { $regex: keyword, $options: "i" } },      //  for remove case sensitive here defined I  ( i menas Insensitive)
                // { description: { $regex: keyword, $options: "i" } },
                // { category: { $regex: keyword, $options: "i" } },
                // { brand: { $regex: keyword, $options: "i" } },
                // { price: { $regex: keyword, $options: "i" } },
                // { color: { $regex: keyword, $options: "i" } },
                // { size: { $regex: keyword, $options: "i" } },
                // { quantity: { $regex: keyword, $options: "i" } },
                // { rating: { $regex: keyword, $options: "i" } },
                // { reviews: { $regex: keyword, $options: "i" } }

            ]
        })
        
        res.json(results);
        
    } catch (error) {
        res.status(500).json({ error: error.message });  
    }
}
 export default search; 