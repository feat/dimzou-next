import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import { ReactComponent as PageIcon } from '../../assets/icon-page.svg';
import { ReactComponent as BookIcon } from '../../assets/icon-book.svg';
import { ReactComponent as BookHasContentIcon } from '../../assets/icon-book-has-content.svg';
import { ReactComponent as BookOpenedIcon } from '../../assets/icon-book-opened.svg';

import { ReactComponent as CollapseIcon } from '../../assets/icon-collapse-all.svg';
import { ReactComponent as ExpandedIcon } from '../../assets/icon-section-expanded.svg';
import { ReactComponent as CollapsedIcon } from '../../assets/icon-section-collapsed.svg';
import { ReactComponent as TrashIcon } from '../../assets/icon-trash.svg';
import { ReactComponent as HomeIcon } from '../../assets/icon-home.svg';
import { ReactComponent as BackIcon } from '../../assets/icon-backward.svg';
import { ReactComponent as ForwardIcon } from '../../assets/icon-forward.svg';

// import { ReactComponent as RegionBlockIcon } from '../../assets/icon-region-block.svg';
// import { ReactComponent as SubTitleIcon } from '../../assets/icon-subtitle.svg';
import { ReactComponent as TextBlockIcon } from '../../assets/icon-text-block.svg';
import { ReactComponent as HeadingIcon } from '../../assets/icon-heading.svg';
import { ReactComponent as OrderListIcon } from '../../assets/icon-order-list.svg';
import { ReactComponent as UnorderListIcon } from '../../assets/icon-unorder-list.svg';
import { ReactComponent as BoldIcon } from '../../assets/icon-bold.svg';
import { ReactComponent as LightIcon } from '../../assets/icon-light.svg';
import { ReactComponent as CodeIcon } from '../../assets/icon-code.svg';
import { ReactComponent as ItalicIcon } from '../../assets/icon-italic.svg';
import { ReactComponent as BlockquoteIcon } from '../../assets/icon-blockquote.svg';
import { ReactComponent as CodeBlockIcon } from '../../assets/icon-code-block.svg';

import { ReactComponent as CopyIcon } from '../../assets/icon-copy.svg';
import { ReactComponent as ReleaseIcon } from '../../assets/icon-release.svg';

// import { ReactComponent as VersionsIcon } from '../../assets/icon-versions.svg';
import { ReactComponent as RewordIcon } from '../../assets/icon-reword.svg';
import { ReactComponent as ShareIcon } from '../../assets/icon-share.svg';
import { ReactComponent as CommentIcon } from '../../assets/icon-comment.svg';
import { ReactComponent as FocusIcon } from '../../assets/icon-focus.svg';
// import { ReactComponent as GlobalIcon } from '../../assets/icon-global.svg';
// import { ReactComponent as ContactIcon } from '../../assets/icon-contact.svg';
import { ReactComponent as PublicIcon } from '../../assets/icon-public.svg';
import { ReactComponent as GroupIcon } from '../../assets/icon-group.svg';

import { ReactComponent as RoleOwnerIcon } from '../../assets/icon-role-owner.svg';
import { ReactComponent as RoleAdminIcon } from '../../assets/icon-role-admin.svg';
import { ReactComponent as RoleParticipatorIcon } from '../../assets/icon-role-participator.svg';
import { ReactComponent as RoleBlockedIcon } from '../../assets/icon-role-blocked.svg';

import { ReactComponent as DieIIcon } from '../../assets/icon-die-i.svg';
import { ReactComponent as DieIIIcon } from '../../assets/icon-die-ii.svg';
import { ReactComponent as DieIIIIcon } from '../../assets/icon-die-iii.svg';
import { ReactComponent as DieIVIcon } from '../../assets/icon-die-iv.svg';
import { ReactComponent as DieVIcon } from '../../assets/icon-die-v.svg';
import { ReactComponent as DieVIIcon } from '../../assets/icon-die-vi.svg';

const iconMap = {
  page: PageIcon,

  book: BookIcon,
  bookHasContent: BookHasContentIcon,
  bookOpened: BookOpenedIcon,

  collapse: CollapseIcon,
  collapsed: CollapsedIcon,
  expanded: ExpandedIcon,

  trash: TrashIcon,
  copy: CopyIcon,

  home: HomeIcon,
  back: BackIcon,
  forward: ForwardIcon,
  focus: FocusIcon,

  // regionBlock: RegionBlockIcon,
  // subTitle: SubTitleIcon,
  textBlock: TextBlockIcon,
  heading: HeadingIcon,
  orderList: OrderListIcon,
  unorderList: UnorderListIcon,
  bold: BoldIcon,
  light: LightIcon,
  code: CodeIcon,
  italic: ItalicIcon,
  blockquote: BlockquoteIcon,
  codeBlock: CodeBlockIcon,

  release: ReleaseIcon,

  // versions: VersionsIcon,
  reword: RewordIcon,
  share: ShareIcon,
  comment: CommentIcon,

  public: PublicIcon,
  group: GroupIcon,

  roleOwner: RoleOwnerIcon,
  roleAdmin: RoleAdminIcon,
  roleParticipator: RoleParticipatorIcon,
  roleBlocked: RoleBlockedIcon,

  dieI: DieIIcon,
  dieII: DieIIIcon,
  dieIII: DieIIIIcon,
  dieIV: DieIVIcon,
  dieV: DieVIcon,
  dieVI: DieVIIcon,
};

export const names = Object.keys(iconMap);

export default function Icon({ name, ...rest }) {
  const Target = iconMap[name];
  invariant(Target, `No related icon found: ${name}`);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Target {...rest} />;
}

Icon.propTypes = {
  name: PropTypes.oneOf(names),
};
