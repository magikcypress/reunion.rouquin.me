const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { question } = JSON.parse(event.body);
  const apiKey = process.env.OPENAIKEY; // Clé API OpenAI stockée dans Netlify

  const apiUrl = 'https://api.openai.com/v1/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      prompt: question,
      max_tokens: 150,
      temperature: 0.7
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ response: data.choices[0].text.trim() })
  };
};
