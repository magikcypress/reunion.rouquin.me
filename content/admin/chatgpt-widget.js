const ChatGPTWidgetControl = createClass({
  handleInputChange(event) {
    this.setState({ value: event.target.value });
  },
  getInitialState() {
    return { value: this.props.value || '' };
  },
  render() {
    return h('div', {}, [
      h('textarea', {
        value: this.state.value,
        onChange: this.handleInputChange,
        placeholder: 'Posez une question à ChatGPT',
      }),
      h('button', {
        onClick: this.handleSendToChatGPT
      }, 'Envoyer'),
      h('div', { id: 'chatgpt-response' }, 'Réponse ici...')
    ]);
  },
  handleSendToChatGPT() {
    const question = this.state.value;
    const apiKey = process.env.OPENAIKEY; // Remplacez par votre clé API OpenAI
    const apiUrl = 'https://api.openai.com/v1/completions';

    fetch(apiUrl, {
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
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('chatgpt-response').innerText = data.choices[0].text.trim();
    })
    .catch(error => {
      document.getElementById('chatgpt-response').innerText = "Erreur : " + error;
    });
  }
});

const ChatGPTWidgetPreview = createClass({
  render() {
    return h('div', {}, 'ChatGPT Widget: ', this.props.value);
  }
});

CMS.registerWidget('chatgpt', ChatGPTWidgetControl, ChatGPTWidgetPreview);
