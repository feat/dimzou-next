import { defineMessages } from '@/services/intl';

export default defineMessages({
  required: {
    id: 'form.validation.required',
    defaultMessage: '{ field } is required.',
  },
  shortRequired: {
    id: 'form.validation.short-required',
    defaultMessage: 'Required',
  },
  confirmed: {
    id: 'form.validation.confirmed',
    defaultMessage: '{ field } and { confirm } should be equal.',
  },
  emailFormat: {
    id: 'form.validation.email-format',
    defaultMessage: '{ field } value should be a valid email address',
  },
  phoneFormat: {
    id: 'form.validation.phone-format',
    defaultMessage: '{ field } should be a valid phone number',
  },
  wordCountLimit: {
    id: 'form.validation.count',
    defaultMessage: '{ field } cannot be more than { count } words',
  },
  max: {
    id: 'form.validation.max',
    defaultMessage: 'Max length: { length }',
  },
  min: {
    id: 'form.validation.min-len',
    defaultMessage: 'Min Length: {length}',
  },
  dateAfter: {
    id: 'form.validation.date-after',
    defaultMessage: '{endDate} should be after {startDate}',
  },
});
