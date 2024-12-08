const sleepData = new Map();

const handleGetSleepData = (req, res) => {
  const userId = req.userId;
  console.log('Fetching sleep data for user:', userId);
  if (sleepData.has(userId)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ sleepEntries: sleepData.get(userId) }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ sleepEntries: [] }));
  }
};

const handlePostSleepData = (req, res) => {
  const userId = req.userId;
  try {
    const sleepEntry = JSON.parse(req.body);
    console.log('Adding sleep entry for user:', userId, sleepEntry);
    if (!sleepData.has(userId)) {
      sleepData.set(userId, []);
    }
    sleepData.get(userId).push(sleepEntry);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Data added successfully' }));
  } catch (error) {
    console.error('Error adding sleep entry:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { handleGetSleepData, handlePostSleepData };

