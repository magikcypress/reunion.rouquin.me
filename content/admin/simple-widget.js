const SimpleWidgetControl = createClass({
  render() {
    return h('input', {
      type: 'text',
      value: this.props.value,
      onChange: e => this.props.onChange(e.target.value),
      placeholder: 'Entrez un texte'
    });
  }
});

const SimpleWidgetPreview = createClass({
  render() {
    return h('div', {}, 'Aperçu: ', this.props.value);
  }
});

CMS.registerWidget('simple', SimpleWidgetControl, SimpleWidgetPreview);
