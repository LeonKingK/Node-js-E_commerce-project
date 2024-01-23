const router = require('express').Router();
const controller = require('../controllers/tag');
const { saveSingleFile } = require('../utils/gallery');

router.get('/', controller.all);
router.post('/', saveSingleFile, controller.add);

router.route('/:id')
    .get(controller.get)
    .patch(saveSingleFile, controller.patch)
    .delete(controller.drop)


module.exports = router;