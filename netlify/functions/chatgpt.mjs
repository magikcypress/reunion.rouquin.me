export default async (event) => {
  const apiKey = process.env.OPENAIKEY;
	const timeOut = 25000;

  // Récupère le paramètre "pie" de la requête, ou utilise une valeur par défaut
  const pie =
    event.queryStringParameters?.pie ??
    "something inspired by a springtime garden";

	const timeoutId = setTimeout(() => controller.abort(), timeOut);

  try {
    // Fait la requête à l'API OpenAI
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` // Utilise la clé API OpenAI
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Vous êtes boulanger. L'utilisateur vous demande une recette de tarte. Vous répondrez en donnant la recette. Utilisez le format markdown pour formater votre réponse."
          },
          { role: "user", content: pie.slice(0, 500) }
        ],
        stream: true // Activation du streaming dans l'API OpenAI
      })
    });

		console.log(res);
		clearTimeout(timeoutId);

    // Vérifie si la réponse de l'API OpenAI est correcte
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ error: "Erreur lors de l'appel à OpenAI" })
      };
    }

    // Récupère la réponse sous forme de texte
    const body = await res.text();

    // Retourne la réponse en tant qu'événement Server-Sent (streaming)
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream" // Mimetype pour server-sent events
      },
      body // Retourne le contenu récupéré depuis OpenAI
    };
  } catch (error) {
		console.log(error);
    // Gère les erreurs potentielles et retourne une réponse d'erreur
    return {
      statusCode: 502,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: `Erreur interne: ${error.message}` })
    };

  }
};
