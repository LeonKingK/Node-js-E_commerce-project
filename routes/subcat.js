const router = require('express').Router();
const controller = require('../controllers/subcat');
const { saveSingleFile }=require('../utils/gallery')

router.post('/',saveSingleFile, controller.add);
router.get('/', controller.all);

router.route('/:id')
    .get(controller.get)
    .delete(controller.drop)
    .patch(saveSingleFile,controller.patch)

module.exports = router;
