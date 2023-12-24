const multer = require('multer');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  let accceptableTypes = []
  if (req.body.type === 'photo') {
    accceptableTypes = ['image/jpeg', 'image/png']
  } else if (req.body.type === 'video') {
    accceptableTypes = ['video/mp4']
  }
  // validate
  if (accceptableTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb('Please pick the right file type and try again', false);
  }
};


const upload = multer({
  storage, fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 } // 10mb maximum
}).array('file');

module.exports = upload