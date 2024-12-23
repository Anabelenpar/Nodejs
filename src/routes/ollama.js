const { generateResponse } = require('../services/ollamaService');

const handleOllamaRequest = async (req, res) => {
  try {
    console.log('Received Ollama request');
    const { prompt } = JSON.parse(req.body);
    console.log('Prompt:', prompt);
    
    const response = await generateResponse(prompt);
    console.log('Ollama response:', response);
    
    if (!response) {
      throw new Error('Respuesta vacía de Ollama');
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ response }));
  } catch (error) {
    console.error('Error in Ollama request:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Error processing Ollama request', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }));
  }
};

module.exports = { handleOllamaRequest };