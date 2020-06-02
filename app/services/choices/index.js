let choices = {};

export const setChoices = (data) => {
  choices = { ...data };
};

export const getChoices = () => choices;
