import { defineMessages } from '@/services/intl';

import {
  LANGUAGE_LEVEL_NATIVE,
  LANGUAGE_LEVEL_WORKABLE,
  LANGUAGE_LEVEL_PROFICIENCY,
  GENDER_FEMALE,
  GENDER_MALE,
  MARRIAGE_MARRIED,
  MARRIAGE_SINGLE,
  EDUCATION_TYPE_SENIOR,
  EDUCATION_TYPE_COLLEGE,
  EDUCATION_TYPE_TRAINING,
} from './constants';


export const profile = defineMessages({
  genderLabel: {
    id: 'user.profile-field.gender',
    defaultMessage: 'Gender',
  },
  ageLabel: {
    id: 'user.profile-field.age',
    defaultMessage: 'Age',
  },
  dobLabel: {
    id: 'user.profile-field.dob',
    defaultMessage: 'Date Of Birth',
  },
  marriageLabel: {
    id: 'user.profile-field.marriage',
    defaultMessage: 'Status',
  },
  nameLabel: {
    id: 'user.profile-field.name',
    defaultMessage: 'Name',
  },
  firstnameLabel: {
    id: 'user.profile-field.firstname',
    defaultMessage: 'Firstname',
  },
  lastnameLabel: {
    id: 'user.profile-field.lastname',
    defaultMessage: 'Lastname',
  },
  nameOrderLabel: {
    id: 'user.profile-field.name-order',
    defaultMessage: 'Name Order',
  },
});

export const languageLevel = defineMessages({
  [LANGUAGE_LEVEL_NATIVE]: {
    id: 'user.language-level.native',
    defaultMessage: 'Native',
  },
  [LANGUAGE_LEVEL_WORKABLE]: {
    id: 'user.language-level.workable',
    defaultMessage: 'Workable',
  },
  [LANGUAGE_LEVEL_PROFICIENCY]: {
    id: 'user.language-level.proficiency',
    defaultMessage: 'Proficiency',
  },
});

export const genderOption = defineMessages({
  [GENDER_MALE]: {
    id: 'user.gender-option.male',
    defaultMessage: 'Male',
  },
  [GENDER_FEMALE]: {
    id: 'user.gender-option.female',
    defaultMessage: 'Female',
  },
});

export const marriageOption = defineMessages({
  [MARRIAGE_SINGLE]: {
    id: 'user.marriage-option.single',
    defaultMessage: 'Single',
  },
  [MARRIAGE_MARRIED]: {
    id: 'user.marriage-option.married',
    defaultMessage: 'Married',
  },
});

export const educationType = defineMessages({
  [EDUCATION_TYPE_SENIOR]: {
    id: 'user.education-type.senior',
    defaultMessage: 'Senior High',
  },
  [EDUCATION_TYPE_COLLEGE]: {
    id: 'user.education-type.college',
    defaultMessage: 'College',
  },
  [EDUCATION_TYPE_TRAINING]: {
    id: 'user.education-type.training',
    defaultMessage: 'Training',
  },
});

export const statistics = defineMessages({
  draft_bundle_count: {
    id: 'user.statistics.draft',
    defaultMessage: 'Draft',
  },
  published_bundle_count: {
    id: 'user.statistics.published',
    defaultMessage: 'Published',
  },
  comment_count: {
    id: 'user.statistics.comments',
    defaultMessage: 'Comments',
  },
  like_count: {
    id: 'user.statistics.likes',
    defaultMessage: 'Likes',
  },
  liked_count: {
    id: 'user.statistics.like-received',
    defaultMessage: 'Liked',
  },
});

export const dimzouScore = defineMessages({
  original_score: {
    id: 'user.dimzou-score.original',
    defaultMessage: 'Original',
  },
  contribution_score: {
    id: 'user.dimzou-score.contribution',
    defaultMessage: 'Contribution',
  },
  fans_score: {
    id: 'user.dimzou-score.fans',
    defaultMessage: 'Fans',
  },
  score: {
    id: 'user.dimzou-score.score',
    defaultMessage: '{num} pts',
  },
})