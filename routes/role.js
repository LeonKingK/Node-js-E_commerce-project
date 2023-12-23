const router=require('express').Router();
const controller=require('../controllers/role');
const Role = require('../models/role');
const {PermitSchema,AllSchema,RoleSchema}=require('../utils/schema');
const {validateBody,validateParam}=require('../utils/validator');


router.post('/',[validateBody(PermitSchema.add),controller.add]);

router.post('/add/permit',[validateBody(RoleSchema.addPermit),controller.roleAddPermit]);
router.post('/remove/permit',[validateBody(RoleSchema.addPermit),controller.roleRomovePermit])

router.get('/',controller.all);

router.route('/:id')
    .get([validateParam(AllSchema.id,'id'),validateBody(PermitSchema.add),controller.get])
    .patch([validateParam(AllSchema.id,'id'),controller.patch])
    .delete([validateParam(AllSchema.id,'id'),controller.drop])


module.exports=router;
