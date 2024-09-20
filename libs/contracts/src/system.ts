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
  PERMISSIONS = 'PERMISSIONS',
}

export enum RoleActions {
  ASSIGN = 'ASSIGN',
  REVOKE = 'REVOKE',
  ASSIGNED_PERMISSIONS = 'ASSIGNED_PERMISSIONS',
}

export enum TimeActions {
  START_WATCH = 'START_WATCH',
  STOP_WATCH = 'STOP_WATCH',
  CONTINUE_WATCH = 'CONTINUE_WATCH',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum AvalilableRouteCollections {
  USER = 'User',
  CLIENT = 'Client',
  ROLE = 'Role',
  PERMISSION = 'Permission',
  TIME = 'Time',
}