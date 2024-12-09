const SleepEntry = require('../models/SleepEntry');

const handleGetSleepData = async (req, res) => {
  const userId = req.userId;
  console.log('Fetching sleep data for user:', userId);
  try {
    const sleepEntries = await SleepEntry.find({ userId });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ sleepEntries }));
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

const handlePostSleepData = async (req, res) => {
  const userId = req.userId;
  try {
    const sleepEntry = JSON.parse(req.body);
    console.log('Adding sleep entry for user:', userId, sleepEntry);
    const newEntry = new SleepEntry({ ...sleepEntry, userId });
    await newEntry.save();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Data added successfully' }));
  } catch (error) {
    console.error('Error adding sleep entry:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { handleGetSleepData, handlePostSleepData };

