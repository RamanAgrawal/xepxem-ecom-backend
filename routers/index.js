import express from 'express'


const router = express.Router();

//................................................................
import { ForgetPassword, userLogin, userRegister, ResetPassword, profile } from '../controllers/user.controllers.js';

router.post("/register", userRegister)
router.post("/login", userLogin)
router.post("/forget_password", ForgetPassword)
router.post("/reset_password/:id/:token",ResetPassword)
router.get('/profile', profile);


//................................................................
import { getAllUsers } from '../controllers/admin.controller.js';
import {auth, authorize} from '../middleware/authToken.js'

router.get('/Allusers',auth, authorize(['admin']), getAllUsers);

//.........................................................................................................
import { addProd, getProd, editProd, deleteProd } from '../controllers/product.controller.js';
import { upload } from '../middleware/multer.js';

router.post('/addProd', upload.single('image'),addProd);
router.get('/getProd', getProd);
router.put('/editProd/:id', upload.single('image'),editProd);
router.delete('/deleteProd/:id', deleteProd);

//...................................................................................................
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cart.controller.js';

router.post('/cart', auth, addToCart);
router.get('/cart', auth, getCart);
router.delete('/cart', auth, removeFromCart);
router.put('/cart', auth, updateCartItem);


//...............................................................................................................
import { placeOrder, getOrder } from '../controllers/order.controller.js';

router.post('/order', auth, placeOrder);
router.get('/order', auth, getOrder);



// ........................................................................................................
import payment from '../controllers/payment.js';
router.post('/payment', auth, payment);


//........................................................................................................
import search from '../controllers/search.js';
router.get('/search/:keyword', search)





export {router}