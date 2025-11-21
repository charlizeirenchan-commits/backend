const fs = require('fs');
const HttpError = require('../models/http-error');
const Place = require('../models/place');

exports.createPlace = async (req, res, next) => {
  const { title, description, address, creator } = req.body;
  if (!req.file) {
    return next(new HttpError('No image provided.', 422));
  }
  const imagePath = req.file.path.replace(/\\/g, '/');
  const createdPlace = new Place({
    title, description, image: imagePath, address, creator
  });
  try {
    await createdPlace.save();
    res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
  } catch (err) {
    // rollback uploaded file
    fs.unlink(req.file.path, () => {});
    return next(new HttpError('Creating place failed, please try again.', 500));
  }
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
    if (!place) return next(new HttpError('Could not find place for this id.', 404));
    const imagePath = place.image;
    await place.remove();
    fs.unlink(imagePath, err => {
      if (err) console.log('Failed to delete image file:', err);
    });
    res.status(200).json({ message: 'Deleted place.' });
  } catch (err) {
    return next(new HttpError('Deleting place failed, please try again.', 500));
  }
};
