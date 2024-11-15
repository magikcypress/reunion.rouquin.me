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
				style: {
					width: '100%',
					height: '50px',
					padding: '15px',
					fontFamily: 'Arial',
					fontSize: '16px',
					borderRadius: '8px',
					border: '1px solid #ccc',
					backgroundColor: '#f9f9f9',
				},
      }),
      h('button', {
        onClick: this.handleSendToChatGPT
      }, 'Envoyer'),
      h('div', { id: 'chatgpt-response', class: 'chatgpt-response' }, 'Réponse ici...')
    ]);
  },
  handleSendToChatGPT() {
    const question = this.state.value;
    const apiUrl = '/.netlify/functions/chatgpt';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question })
    })
    .then(response => {
			console.log(response);
      return response.json();
    })
    .then(data => {
      const trimmedData = data.d.trim();
      document.getElementById('chatgpt-response').innerText = trimmedData;
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
