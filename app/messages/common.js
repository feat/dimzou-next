import { defineMessages } from '@/services/intl';

export default defineMessages({
  siteName: {
    id: 'app.base.site-name',
    defaultMessage: 'Feat.com',
  },
  awesome: {
    id: 'app.base.awesome',
    defaultMessage: 'Awesome',
  },
  dimzou: {
    id: 'app.base.dimzou',
    defaultMessage: 'Dimzou',
  },
  filex: {
    id: 'app.base.file-x',
    defaultMessage: 'File-X',
  },
  party: {
    id: 'app.base.party',
    defaultMessage: 'Party',
  },
  demand: {
    id: 'app.base.demand',
    defaultMessage: 'Demand',
  },
  search: {
    id: 'app.base.search',
    defaultMessage: 'Search',
  },
  settings: {
    id: 'app.base.settings',
    defaultMessage: 'Settings',
  },
  slogan: {
    id: 'app.base.slogan',
    defaultMessage: 'Make the most of your talent',
  },
  anonymous: {
    id: 'app.common.anonymous',
    defaultMessage: 'Anonymous',
  },
  error: {
    id: 'app.common.error',
    defaultMessage: 'Error',
  },
  retry: {
    id: 'app.common.retry',
    defaultMessage: 'Retry',
  },
  copyright: {
    id: 'app.common.copyright',
    defaultMessage: 'Copyright',
  },
  allRightsReserved: {
    id: 'app.common.all-rights-reserved',
    defaultMessage: 'All rights reserved',
  },
  termsOfUse: {
    id: 'app.common.terms-of-use',
    defaultMessage: 'Terms of Use',
  },
  legal: {
    id: 'app.common.legal',
    defaultMessage: 'Legal',
  },
  readMore: {
    id: 'app.common.read-more',
    defaultMessage: 'Read More',
  },
  loading: {
    id: 'app.common.loading',
    defaultMessage: 'Loading...',
  },
  loadMore: {
    id: 'app.common.loadMore',
    defaultMessage: 'Load More',
  },
  account: {
    id: 'app.common.account',
    defaultMessage: 'Account',
  },
  register: {
    id: 'app.common.register',
    defaultMessage: 'Register',
  },

  category: {
    id: 'app.common.category',
    defaultMessage: 'Category',
  },
  draft: {
    id: 'app.common.draft',
    defaultMessage: 'Draft',
  },
  like: {
    id: 'app.common.like',
    defaultMessage: 'Like',
  },
  permission: {
    id: 'app.common.permission',
    defaultMessage: 'Permission',
  },
  invitation: {
    id: 'app.common.invitation',
    defaultMessage: 'Invitation',
  },
  phone: {
    id: 'app.common.phone',
    defaultMessage: 'Phone',
  },
  email: {
    id: 'app.common.email',
    defaultMessage: 'Email',
  },
  cancelAction: {
    id: 'app.common.action.cancel',
    defaultMessage: 'Cancel',
  },
  saveAction: {
    id: 'app.common.action.save',
    defaultMessage: 'Save',
  },
  addAction: {
    id: 'app.common.action.add',
    defaultMessage: 'Add',
  },
  editAction: {
    id: 'app.common.action.edit',
    defaultMessage: 'Edit',
  },
  lockAction: {
    id: 'app.common.action.lock',
    defaultMessage: 'Lock',
  },
  emptyPlaceholder: {
    id: 'app.common.empty-placehodler',
    defaultMessage: '<Empty>',
  },
  requestSucceeded: {
    id: 'app.common.request-succeeded',
    defaultMessage: 'Request succeeded',
  },
  noContentHint: {
    id: 'app.common.no-content-hint',
    defaultMessage: 'No Content',
  },
  errorHint: {
    id: 'app.common.error-hint',
    defaultMessage: 'Something went wrong.',
  },
});

export const filexMessages = defineMessages({
  filex: {
    id: 'xfile.common.filex',
    defaultMessage: 'File-X',
  },
  theMoments: {
    id: 'file-x.common.the-moment',
    defaultMessage: 'The Moments',
  },
  placeAround: {
    id: 'file-x.common.place-around',
    defaultMessage: 'Place Around',
  },
  myEvents: {
    id: 'file-x.common.my-events',
    defaultMessage: 'My Events',
  },
  newEvent: {
    id: 'file-x.common.new-event',
    defaultMessage: 'New Event',
  },
  events: {
    id: 'file-x.common.events',
    defaultMessage: 'Events',
  },
});

export const dateCompos = defineMessages({
  year: {
    id: 'app.date-compos.year',
    defaultMessage: 'year',
  },
  month: {
    id: 'app.date-compos.month',
    defaultMessage: 'month',
  },
  hour: {
    id: 'app.date-compos.hour',
    defaultMessage: 'hour',
  },
  minute: {
    id: 'app.date-compos.minute',
    defaultMessage: 'minute',
  },
  date: {
    id: 'app.date-compos.date',
    defaultMessage: 'date',
  },
  time: {
    id: 'app.date-compos.time',
    defaultMessage: 'time',
  },
});

export const entityTypeLabels = defineMessages(
  {
    node: {
      id: 'app.entity-type.draft',
      defaultMessage: 'Draft',
    },
    awesome: {
      id: 'app.entity-type.awesome',
      defaultMessage: 'Awesome',
    },
    demand: {
      id: 'app.entity-type.demand',
      defaultMessage: 'Demand',
    },
    publication: {
      id: 'app.entity-type.publication',
      defaultMessage: 'Publication',
    },
    expertise: {
      id: 'app.entity-type.expertise',
      defaultMessage: 'Expertise',
    },
  },
  {
    fallback: (key) => ({
      id: `app.entity-type.${key}`,
      defaultMessage: key,
    }),
  },
);

export const adminAction = defineMessages({
  edit: {
    id: 'app.admin-action.edit',
    defaultMessage: 'Edit',
  },
  view: {
    id: 'app.admin-action.view',
    defaultMessage: 'View',
  },
  delete: {
    id: 'app.admin-action.delete',
    defaultMessage: 'Delete',
  },
});

export const visibility = defineMessages({
  visible: {
    id: 'option.visibility.visible',
    defaultMessage: 'Visible',
  },
  hidden: {
    id: 'option.visibility.hidden',
    defaultMessage: 'Hidden',
  },
});

export const pageTitle = defineMessages({
  // index: {
  //   id: 'app.page-title.index',
  //   defaultMessage: '',
  // },
  oppIndex: {
    id: 'app.page-title.opp-index',
    defaultMessage: 'Opportunity',
  },
  dimzouIndex: {
    id: 'app.page-title.dimzou-index',
    defaultMessage: 'Dimzou',
  },
  awesomeIndex: {
    id: 'app.page-title.awesome-index',
    defaultMessage: 'Awesome',
  },
  signin: {
    id: 'app.page-title.signin',
    defaultMessage: 'Sign in',
  },
  signup: {
    id: 'app.page-title.signup',
    defaultMessage: 'Sign up',
  },
  accountRecovery: {
    id: 'app.page-title.account-recovery',
    defaultMessage: 'Account Recovery',
  },
  policy: {
    id: 'app.page-title.policy',
    defaultMessage: 'Policy',
  },
  settings: {
    id: 'app.page-title.settings',
    defaultMessage: 'Settings',
  },
  userPage: {
    id: 'app.page-title.user-page',
    defaultMessage: 'Page of {username}',
  },
  userDimzou: {
    id: 'app.page-title.user-dimzou',
    defaultMessage: `{username}'s dimzou`,
  },
  userFilex: {
    id: 'app.page-title.user-filex',
    defaultMessage: `{username}'s filex`,
  },
  application: {
    id: 'app.page-title.application',
    defaultMessage: 'Application',
  },
  awesomeCategory: {
    id: 'app.page-title.awesome-category',
    defaultMessage: 'Awesome in {category}',
  },
  dimzouCategory: {
    id: 'app.page-title.dimzou-category',
    defaultMessage: 'Dimzou in {category}',
  },
  oppCategory: {
    id: 'app.page-title.opp-category',
    defaultMessage: 'Opportunities in {category}',
  },
  about: {
    id: 'app.page-title.about',
    defaultMessage: 'About',
  },
  invitation: {
    id: 'app.page-title.invitation',
    defaultMessage: 'Invitation',
  },
  oppDetail: {
    id: 'app.page-title.opp-detail',
    defaultMessage: 'Demand: {title}',
  },
  authorize: {
    id: 'app.page-title.authorize',
    defaultMessage: 'Authorize',
  },
});
