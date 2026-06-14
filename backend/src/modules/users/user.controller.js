const User = require('../auth/user.model');
const logger = require('../../utils/logger');
const { admin } = require('../../config/firebase');
const crypto = require('crypto');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
exports.getProfile = async (request, reply) => {
  try {
    const user = await User.findById(request.user.id);
    if (!user) {
      return reply.status(404).send({ success: false, error: 'User not found' });
    }
    reply.send({ success: true, data: user });
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    reply.status(500).send({ success: false, error: error.message });
  }
};

// @desc    Update user profile (with avatar upload to Firebase)
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = async (request, reply) => {
  try {
    const userId = request.user.id;
    let updateData = {};
    let avatarUrl = null;

    // Process multipart form data
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'avatar') {
        // Handle file upload to Firebase Storage
        const bucket = admin.storage().bucket();
        const extension = path.extname(part.filename) || '.jpg';
        const fileName = `avatars/${userId}_${crypto.randomBytes(4).toString('hex')}${extension}`;
        const file = bucket.file(fileName);

        // Upload stream
        await new Promise((resolve, reject) => {
          const writeStream = file.createWriteStream({
            metadata: {
              contentType: part.mimetype,
            },
            public: true, // Make file publicly readable
          });

          part.file.pipe(writeStream)
            .on('error', (err) => reject(err))
            .on('finish', () => resolve());
        });

        // Make file public (some bucket settings require this explicitly)
        try {
          await file.makePublic();
        } catch (err) {
          // Ignore if public access is prevented by bucket policy, but usually fine
        }

        // Get public URL
        avatarUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        updateData.avatar = avatarUrl;
      } else if (part.type === 'field') {
        // Handle text fields
        if (part.value !== 'null' && part.value !== 'undefined' && part.value !== '') {
            updateData[part.fieldname] = part.value;
        }
      }
    }

    // Update user in DB
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return reply.status(404).send({ success: false, error: 'User not found' });
    }

    reply.send({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    reply.status(500).send({ success: false, error: error.message });
  }
};
