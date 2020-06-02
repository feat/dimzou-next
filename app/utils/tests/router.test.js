import { getAsPath } from '../router'

describe('Router utils', () => {
  it('getAsPath', () => {
    const path1 = getAsPath('/profile/:userId', { userId: '123123' });
    expect(path1).toBe('/profile/123123')
    const path2 = getAsPath('/profile/:userId/dimzou', { userId: '123123'});
    expect(path2).toBe('/profile/123123/dimzou');
    const path3 = getAsPath('/profile/:bundleId/:nodeId', { bundleId: 123, nodeId: 456 });
    expect(path3).toBe('/profile/123/456');
    const path4 = getAsPath('/profile/:bundleId/:nodeId?', { bundleId: 123123 });
    expect(path4).toBe('/profile/123123');
    const path5 = getAsPath('/profile/:bundleId/:nodeId?', { bundleId: 123, nodeId: 456 });
    expect(path5).toBe('/profile/123/456');
    const path6 = getAsPath('/profile/:bundleId', { bundleId: 123, invitation: 456 });
    expect(path6).toBe('/profile/123?invitation=456');
  })
})