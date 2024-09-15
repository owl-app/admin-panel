export enum AvalilableCollections {
  USER = 'User',
  CLIENT = 'Client',
  ROLE = 'Role',
  PERMISSION = 'Permission',
  TIME = 'Time',
}

export enum CrudActions {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LIST = 'LIST',
}

export enum UserActions {
  ME = 'ME',
  LOGOUT = 'LOGOUT',
  ASSIGN_ACCESS = 'ASSIGN_ACCESS',
}

export enum RoleActions {
  ASSIGN = 'ASSIGN',
  REVOKE = 'REVOKE',
  ASSIGNED_PERMISSIONS = 'ASSIGNED_PERMISSIONS',
}

export enum TimeActions {
  START_WATCH = 'START_WATCH',
  CONTINUE_WATCH = 'CONTINUE_WATCH',
}

export enum AvalilableRouteCollections {
  USER = 'User',
  CLIENT = 'Client',
  ROLE = 'Role',
  PERMISSION = 'Permission',
  TIME = 'Time',
}