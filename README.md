Courtify backend (full upload support)
- Multer middleware: middleware/file-upload.js (diskStorage -> uploads/images, uuid filenames, MIME filter, size limit)
- Routes:
  POST /api/users/signup (multipart/form-data, image optional)
  POST /api/users/login
  POST /api/places (multipart/form-data, image required)
  DELETE /api/places/:pid
- Static files served at /uploads/images
- Start: npm install && npm start
