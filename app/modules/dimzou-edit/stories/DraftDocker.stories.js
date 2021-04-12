import { actions } from '@storybook/addon-actions';
import AppDndService from '@/services/dnd/AppDndService';
import DraftDocker from '../components/DraftDocker';
export default {
  title: 'Dimzou/Components/DraftDocker',
  component: DraftDocker,
  decorators: [
    (Story) => (
      <AppDndService>
        <div style={{ height: 400 }}>{Story()}</div>
      </AppDndService>
    ),
  ],
};
export const Preview = () => (
  <DraftDocker
    isReleasing={false}
    canRelease
    initRelease={actions('initRelease')}
    isCreatingPage={false}
    initPageCreate={actions('initPageCreate')}
    isCreatingCover={false}
    canCopy={false}
    initCopyCreate={actions('initCopyCreate')}
    canChangeTemplate={false}
    onChangeTemplate={actions('onChangeTemplate')}
    initialTemplate="I"
    // editorStatte={}
    // onEditorStateChange={actions('')}
  />
);
