import { Configuration, OpenAIApi } from "openai";

// Initialiser la configuration avec la clé API
const configuration = new Configuration({
  apiKey: process.env.OPENAIKEY,
});

// Créer une instance de l'API OpenAI
const openai = new OpenAIApi(configuration);

export default async (event) => {
  const apiKey = process.env.OPENAIKEY;
	const timeOut = 25000;

  const pie =
    event.queryStringParameters?.pie ??
    "something inspired by a springtime garden";

	const timeoutId = setTimeout(() => controller.abort(), timeOut);

  try {
    // const res = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${apiKey}`
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //       {
    //         role: "system",
    //         content:
    //           "Vous êtes boulanger. L'utilisateur vous demande une recette de tarte. Vous répondrez en donnant la recette. Utilisez le format markdown pour formater votre réponse."
    //       },
    //       { role: "user", content: pie.slice(0, 500) }
    //     ],
    //     stream: true
    //   })
    // });

		const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Vous êtes boulanger. L'utilisateur vous demande une recette de tarte. Répondez avec une recette en format markdown."
        },
        { role: "user", content: pie.slice(0, 500) }
      ],
      max_tokens: 824, // Limiter le nombre de tokens générés pour éviter une réponse trop longue
    });

		console.log(response);
		clearTimeout(timeoutId);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream"
      },
      body: JSON.stringify(response.data),
    };

  } catch (error) {
		console.log(error);

    return {
      statusCode: 502,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: `Erreur interne: ${error.message}` })
    };

  }
};
