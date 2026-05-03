const Settings = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings.upiId = req.body.upiId || settings.upiId;
      settings.qrCodeUrl = req.body.qrCodeUrl !== undefined ? req.body.qrCodeUrl : settings.qrCodeUrl;
      settings.whatsappNumber = req.body.whatsappNumber || settings.whatsappNumber;
      settings.liveStreamUrl = req.body.liveStreamUrl !== undefined ? req.body.liveStreamUrl : settings.liveStreamUrl;
      settings.howToRegisterUrl = req.body.howToRegisterUrl !== undefined ? req.body.howToRegisterUrl : settings.howToRegisterUrl;
      settings.rules = req.body.rules !== undefined ? req.body.rules : settings.rules;
    }
    
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
