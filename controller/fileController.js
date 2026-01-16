const File = require('../models/fileModel');
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    const fileDoc = new File({
      userId: req.user._id,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype
    });
    await fileDoc.save();
    
    res.json({ 
      fileId: fileDoc._id, 
      fileUrl: fileDoc.path 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
