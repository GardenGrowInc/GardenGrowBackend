const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'duejdbs48', 
  api_key: '291572288538863', 
  api_secret: 'iG9MsVtarL8DVTkCOGYwhjHloLY'
});

module.exports = cloudinary;