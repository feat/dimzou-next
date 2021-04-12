import PhoneLoginForm from './Form';

export default {
  title: 'Auth/PhoneLoginForm',
  component: PhoneLoginForm,
  argTypes: {},
};

export const Preview = (args) => <PhoneLoginForm {...args} />;
Preview.args = {
  initialValues: {},
  router: {
    query: {},
  },
  countryOptions: [
    {
      id: 1,
      calling_code: 86,
    },
  ],
};
