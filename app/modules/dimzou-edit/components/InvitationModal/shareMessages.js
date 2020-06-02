import { defineMessages } from '@/services/intl';

export default defineMessages({
  emailSubject: {
    id: 'dz.invitation.email-subject',
    defaultMessage: 'Dimzou Invitation',
  },
  emailBody: {
    id: 'dz.invitation.email-body',
    defaultMessage:
      '{title} -- from {source}, author: {author}; Friend {username} invites you to join. \n\n Detail: {link}',
  },
  shareText: {
    id: 'dz.invitation.share-text',
    defaultMessage:
      '【{title}】invite you to join editing -- from {source}, author: {author}, good at: {authorExpertise}.',
  },
  paraShareEmailBody: {
    id: 'dz.invitation.para-email-body',
    defaultMessage:
      '{username} (expertise: { userExpertise }) join {title} -- "{ paraText }". \n\n Join and click: {link}',
  },
  paraShareText: {
    id: 'dz.invitation.para-share-text',
    defaultMessage:
      '{username} (expertise: { userExpertise }) is editing "{ paraText }". -- from {source}',
  },
});
