const path = require('path');
const fs = require('fs');

exports.getPrdImage = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '../../../uploads/images/products', fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Ảnh không tồn tại.' });
    }

    res.sendFile(filePath);
  });
};