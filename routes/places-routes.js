const express = require('express');
const { check } = require('express-validator');
const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
  ],
  placesControllers.createPlace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
