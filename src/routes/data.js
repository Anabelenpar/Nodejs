const { SleepEntry } = require('../models');

const handleGetSleepData = async (req, res) => {
  const userId = req.userId;
  try {
    console.log('Fetching sleep data for user:', userId);
    const sleepEntries = await SleepEntry.findAll({ where: { userId } });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ sleepEntries }));
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error', error: error.message }));
  }
};

const handlePostSleepData = async (req, res) => {
  const userId = req.userId;
  try {
    const sleepEntry = JSON.parse(req.body);
    console.log('Adding sleep entry for user:', userId, sleepEntry);
    const newEntry = await SleepEntry.create({ ...sleepEntry, userId });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Data added successfully', entry: newEntry }));
  } catch (error) {
    console.error('Error adding sleep entry:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { handleGetSleepData, handlePostSleepData };

