import { rbacStorageTypeorm } from './rbac-storage-typeorm';

describe('rbacStorageTypeorm', () => {
  it('should work', () => {
    expect(rbacStorageTypeorm()).toEqual('rbac-storage-typeorm');
  });
});
