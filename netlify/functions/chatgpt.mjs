const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const apiKey = process.env.OPENAIKEY;
  const prompt = JSON.parse(event.body).question;
  const timeOut = 25000;
  const controller = new AbortController(); // Création d'un abort controller pour gérer le timeout

  const timeoutId = setTimeout(() => controller.abort(), timeOut);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],  // Utilisation de "messages" pour gpt-3.5-turbo
        max_tokens: 100
      }),
      signal: controller.signal  // Utilisation du signal du controller pour le timeout
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ error: "Erreur lors de l'appel à OpenAI" })
      };
    }

    const data = await res.json();
    console.log(data)
    console.log(data.choices)
    

    if (data.choices) {
      const d = data.choices[0].message.content.trim();
      console.log(d)
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({d})
      };
    } else {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ error: "La réponse de l'API ne contient pas de 'choices' valides." })
      };
    }

  } catch (error) {
    clearTimeout(timeoutId);
    return {
      statusCode: 502,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: `Erreur interne: ${error.message}` })
    };
  }
};
