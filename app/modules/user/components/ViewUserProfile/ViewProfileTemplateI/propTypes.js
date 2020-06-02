import PropTypes from 'prop-types';

export default {
  profile: PropTypes.object,
  educations: PropTypes.array,
  career_experiences: PropTypes.array,
  languages: PropTypes.array,
  open_time: PropTypes.object, // TODO
  expertise: PropTypes.array,
  workplace: PropTypes.object,
  honors_awards: PropTypes.array,
  initOrderCreation: PropTypes.func,
};
