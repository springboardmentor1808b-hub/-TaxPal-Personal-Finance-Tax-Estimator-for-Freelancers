// Simple report endpoint for frontend log/trigger recording
exports.saveReport = async (req, res) => {
  try {
    const { report_type, period, format } = req.body;
    // this endpoint is mostly a stub; can be extended for archived report storage
    res.status(200).json({ message: 'Report data received', report_type, period, format });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
