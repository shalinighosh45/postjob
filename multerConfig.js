const multer = require('multer');
const path = require('path');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload");
    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });

  //stape 3 filter file
  const fileFilter = (req, file, callback) => {
    if (
      file.mimetype.includes("png") ||
      file.mimetype.includes("jpg") ||
      file.mimetype.includes("jpeg") ||
      file.mimetype.includes("webp") 
     
    ) {
      callback(null, true);
    } else {
      console.log("Error in uploading");
      callback(null, false);
    }
  };

  //stape 4 define multer to upload file
  const upload=
    multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: { fieldSize: 1024 * 1024 * 5 },
    })
  ;
  const multiupload=
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fieldSize: 1024 * 1024 * 5 },
  })
;
  module.exports=upload
  module.exports=multiupload

  



  //sxna
  