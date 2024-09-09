export default async (event) => {

	const apiKey = process.env.OPENAIKEY;

	// Get the request from the request query string, or use a default
	const pie =
		event.queryStringParameters?.pie ??
		"something inspired by a springtime garden";

	// The response body returned from "fetch" is a "ReadableStream",
	// so you can return it directly in your streaming response
	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// Set this environment variable to your own key
			"Authorization": `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"Vous êtes boulanger. L'utilisateur vous demande une recette de tarte. Vous répondrez en donnant la recette. Utilisez le format markdown pour formater votre réponse"
				},
				// Use "slice" to limit the length of the input to 500 characters
				{ role: "user", content: pie.slice(0, 500) }
			],
			// Use server-sent events to stream the response
			stream: true
		})
	});

	return new Response(body, {
		headers: {
			// This is the mimetype for server-sent events
			"content-type": "text/event-stream"
		}
	});

};
