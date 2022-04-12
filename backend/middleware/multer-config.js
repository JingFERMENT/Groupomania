const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    
    const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + "." + extension);
  },
});

const fileFilter = (req, file, callback) => {
  if (!(file.mimetype in MIME_TYPES)) {
   callback(new Error("Le format de l'image n'est autorisé !"))
  }
  callback(null, true)
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500000 },
}).single("photo_profil");
