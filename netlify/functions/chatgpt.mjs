export default async (event) => {
  const apiKey = process.env.OPENAIKEY;
	const timeOut = 25000;

  const pie =
    event.queryStringParameters?.pie ??
    "something inspired by a springtime garden";

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
        messages: [
          {
            role: "system",
            content:
              "Vous êtes boulanger. L'utilisateur vous demande une recette de tarte. Vous répondrez en donnant la recette. Utilisez le format markdown pour formater votre réponse."
          },
          { role: "user", content: pie.slice(0, 500) }
        ],
        stream: true
      })
    });

		console.log(res);
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

    const body = await res.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body
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
