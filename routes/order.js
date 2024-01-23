const router=require('express').Router();
const controller= require('../controllers/order');
const { validateToken }=require('../utils/validator');

router.post('/',validateToken(),controller.add);
router.get('/my', validateToken(), controller.getMyOrders);

module.exports=router;