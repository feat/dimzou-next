import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// Do not use DragDropContextProvider, easily cause multi HTML5Backend
export const withDragDropContext = DragDropContext(HTML5Backend);


export const DRAGGABLE_TYPE_USER = 'user';
export const DRAGGABLE_TYPE_COLLABORATOR = 'collaborator';
export const DRAGGABLE_TYPE_AVATAR = 'avatar';
export const DRAGGABLE_TYPE_USER_CONTACT = 'user-contact';
export const DRAGGABLE_TYPE_GROUP_CONTACT = 'group-contact';
