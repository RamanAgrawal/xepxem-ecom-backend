import { User } from "../models/user.model.js";

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password')
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }

}

export { getAllUsers}