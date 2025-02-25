// @unocss-include

export default extendUIConfig({
  button: {
    props: {
      icon: 'i-emojione:rocket',
      outlined: true,
      noUppercase: true,
    }
  },
  textInput: {
    props: {
      label: 'My default label',
      ui: { borderRadius: '0.5rem' },
    },
  },
})
