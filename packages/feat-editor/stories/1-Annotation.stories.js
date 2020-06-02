import React from 'react';
import AuditEditor from './AuditEditor';
import Annotation from './Annotation';
import annotatedHtml from './data/annotated.html';


export default {
  title: 'Annotation Editor',
  component: AuditEditor,
};

export const Annotated = () => <Annotation html={annotatedHtml} />;

