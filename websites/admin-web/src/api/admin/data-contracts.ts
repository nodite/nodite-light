/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** From T, pick a set of properties whose keys are in the union K */
export interface PickInstanceTypeTypeofUserModelUserIdOrUsernameOrNicknameOrEmailOrPhoneOrSexOrAvatarOrPasswordOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
  /** @format double */
  userId: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  sex: 0 | 1;
  avatar: string;
  password: string;
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
}

export type IUser =
  PickInstanceTypeTypeofUserModelUserIdOrUsernameOrNicknameOrEmailOrPhoneOrSexOrAvatarOrPasswordOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

export interface SequelizePaginationIUser {
  items: IUser[];
  /** @format double */
  count: number;
  /** @format double */
  totalCount: number;
  /** @format double */
  totalPage: number;
  /** @format double */
  page: number;
  /** @format double */
  itemsPerPage: number;
}

export interface IResponseSequelizePaginationIUser {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: SequelizePaginationIUser;
}

export interface QueryParams {
  /** @format double */
  page?: number;
  /** @format double */
  itemsPerPage?: number;
  [key: string]: any;
}

export interface IResponseIUser {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IUser;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIUserExcludeKeysUserId {
  username: string;
  nickname: string;
  email: string;
  phone: string;
  sex: 0 | 1;
  avatar: string;
  password: string;
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitIUserUserId = PickIUserExcludeKeysUserId;

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIUserExcludeKeysUserIdOrUsernameOrPassword {
  nickname: string;
  email: string;
  phone: string;
  sex: 0 | 1;
  avatar: string;
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitIUserUserIdOrUsernameOrPassword = PickIUserExcludeKeysUserIdOrUsernameOrPassword;

export interface IPasswordReset {
  /** password */
  password: string;
  /** Confirm password */
  confirmPassword: string;
}

export interface IResponseVoid {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: any;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickInstanceTypeTypeofRoleModelRoleIdOrRoleNameOrRoleKeyOrOrderNumOrIKeyOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  /** @format double */
  roleId: number;
  roleName: string;
  roleKey: string;
  /** @format double */
  orderNum: number;
  iKey: string;
}

export type IRole =
  PickInstanceTypeTypeofRoleModelRoleIdOrRoleNameOrRoleKeyOrOrderNumOrIKeyOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

export interface SequelizePaginationIRole {
  items: IRole[];
  /** @format double */
  count: number;
  /** @format double */
  totalCount: number;
  /** @format double */
  totalPage: number;
  /** @format double */
  page: number;
  /** @format double */
  itemsPerPage: number;
}

export interface IResponseSequelizePaginationIRole {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: SequelizePaginationIRole;
}

export interface IResponseIRole {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IRole;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIRoleExcludeKeysRoleId {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  roleName: string;
  roleKey: string;
  /** @format double */
  orderNum: number;
  iKey: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitIRoleRoleId = PickIRoleExcludeKeysRoleId;

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIRoleExcludeKeysRoleIdOrRoleKey {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  roleName: string;
  /** @format double */
  orderNum: number;
  iKey: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitIRoleRoleIdOrRoleKey = PickIRoleExcludeKeysRoleIdOrRoleKey;

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIMenuMenuIdOrPerms {
  /** @format double */
  menuId: number;
  perms: string;
}

export interface IResponsePickIMenuMenuIdOrPermsArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: PickIMenuMenuIdOrPerms[];
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickInstanceTypeTypeofMenuModelMenuIdOrMenuNameOrParentIdOrOrderNumOrIconOrIKeyOrITypeOrPathOrRedirectOrComponentOrHiddenOrLayoutOrPermsOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  /** @format double */
  orderNum: number;
  iKey: string;
  /** @format double */
  menuId: number;
  menuName: string;
  /** @format double */
  parentId: number;
  icon: string;
  iType: string;
  path: string;
  redirect: string;
  component: string;
  hidden: 0 | 1;
  layout: string;
  perms: string;
}

export type IMenu =
  PickInstanceTypeTypeofMenuModelMenuIdOrMenuNameOrParentIdOrOrderNumOrIconOrIKeyOrITypeOrPathOrRedirectOrComponentOrHiddenOrLayoutOrPermsOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

export interface IResponseIMenuArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IMenu[];
}

export type MenuTree = IMenu & {
  children?: MenuTree[];
  /** @format double */
  level?: number;
};

export interface IResponseMenuTreeArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: MenuTree[];
}

export interface IResponseIMenu {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IMenu;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIMenuExcludeKeysMenuId {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  /** @format double */
  orderNum: number;
  iKey: string;
  menuName: string;
  /** @format double */
  parentId: number;
  icon: string;
  iType: string;
  path: string;
  redirect: string;
  component: string;
  hidden: 0 | 1;
  layout: string;
  perms: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitIMenuMenuId = PickIMenuExcludeKeysMenuId;

export interface IResponseTrue {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: true;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIUserUsernameOrEmailOrPassword {
  username: string;
  email: string;
  password: string;
}

/** Type RegisterBody. */
export type RegisterBody = PickIUserUsernameOrEmailOrPassword;

/** Interface LoginResponse. */
export interface LoginResponse {
  token: string;
  /** @format double */
  expiresIn: number;
}

export interface IResponseLoginResponse {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  /** Interface LoginResponse. */
  data?: LoginResponse;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIUserUsernameOrPassword {
  username: string;
  password: string;
}

/** Type LoginBody. */
export type LoginBody = PickIUserUsernameOrPassword & {
  email?: string;
};

export type JwtDestroyType = boolean | "stateless";

export interface IResponseJwtDestroyType {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: JwtDestroyType;
}
