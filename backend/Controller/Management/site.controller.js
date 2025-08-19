
const Site = require('../../Models/Site/site.model');

// CREATE site
const createSite = async (req, res) => {
  try {
    const { site } = req.body;

    if (!site) return res.status(400).json({ message: 'Site name is required' });

    const newSite = new Site({ site });
    await newSite.save();

    res.status(201).json({ message: 'Site created successfully', data: newSite });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// READ all sites
const getAllSites = async (req, res) => {
  try {
    const sites = await Site.find().sort({ createdAt: -1 });
    res.status(200).json(sites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// READ single site by ID
const getSiteById = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.status(200).json(site);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// UPDATE site by ID
const updateSite = async (req, res) => {
  try {
    const { site } = req.body;

    const updatedSite = await Site.findByIdAndUpdate(
      req.params.id,
      { site },
      { new: true, runValidators: true }
    );

    if (!updatedSite) return res.status(404).json({ message: 'Site not found' });

    res.status(200).json({ message: 'Site updated', data: updatedSite });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE site by ID
const deleteSite = async (req, res) => {
  try {
    const deletedSite = await Site.findByIdAndDelete(req.params.id);
    if (!deletedSite) return res.status(404).json({ message: 'Site not found' });

    res.status(200).json({ message: 'Site deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
  deleteSite,
};
