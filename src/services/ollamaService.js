const axios = require('axios');

const generateResponse = async (prompt) => {
  try {
    console.log('Sending request to Ollama with prompt:', prompt);
    console.log('Ollama API URL:', process.env.OLLAMA_API_URL);
    
    const response = await axios.post(process.env.OLLAMA_API_URL, {
      model: 'llama2',
      prompt: prompt,
      stream: true
    }, {
      responseType: 'stream'
    });

    let fullResponse = '';
    
    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          const json = JSON.parse(line);
          if (json.response) {
            fullResponse += json.response;
            console.log('Partial response:', json.response);
          }
        }
      });

      response.data.on('end', () => {
        console.log('Full response:', fullResponse);
        resolve(fullResponse);
      });

      response.data.on('error', (error) => {
        console.error('Error in Ollama stream:', error);
        reject(error);
      });
    });

  } catch (error) {
    console.error('Error generating response from Ollama:', error.message);
    if (error.response) {
      console.error('Ollama error response:', error.response.data);
      console.error('Ollama error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received from Ollama');
    }
    throw new Error(`Failed to generate response from Ollama: ${error.message}`);
  }
};

module.exports = { generateResponse };