import * as controllers from '../controllers';
import express from 'express';
import  verifyToken  from '../middlewares/verify_token';
const isAdmin = require('../middlewares/verify_roles');
import uploadCloud from '../middlewares/uploader';



const router = express.Router();
//pUBlic routes
router.use(verifyToken)
// router.use(isAdmin)

router.get('/',controllers.getBooks);
router.delete('/',uploadCloud.single('image'),controllers.deleteBook);
router.put('/',uploadCloud.single('image'),controllers.updateBook);
//private routes


router.post('/',uploadCloud.single('image'),controllers.createNewBook);

module.exports = router;