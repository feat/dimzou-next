/* eslint-disable */
import { getImage } from '@/utils/pics';
const isSvgPath = (path) => /\.svg$/.test(path);

const FIRSTNAME_AHEAD = 1;
const LASTNAME_AHEAD = 2;

export function getFullname(data) {
  if (!data) {
    return undefined;
  }
  if (data.username) {
    return data.username;
  }
  const { firstname, lastname, name_order } = data;
  return name_order === LASTNAME_AHEAD
    ? `${lastname} ${firstname}`
    : `${firstname} ${lastname}`;
}

export function getUsername(data = {}) {
  return data.username || (data.uid ?  `${data.uid}` : undefined);
}

export function getAvatar(data, size = 'md') {
  const { avatar } = data;
  if (isSvgPath(avatar) || !size) {
    return avatar;
  }
  return getImage(data.avatars, size, data.avatar);
}

export function getAppLink(data) {
  if (data instanceof Object) {
    return `/profile/${data.uid}`;
  }
  return `/profile/${data}`;
}

export function userFromProfile(profile) {
  const user = {
    uid: profile.uid,
    avatar: profile.avatar,
    username: profile.username || `${profile.uid}`,
    firstname: profile.firstname,
    lastname: profile.lastname,
  };
  return user;
}
