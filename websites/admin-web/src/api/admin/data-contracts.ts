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

export interface IProfile {
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
  roles: string[];
  perms: string[];
}

export interface IResponseIProfile {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IProfile;
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

export type IUserCreate = OmitIUserUserId;

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

export type IUserUpdate = OmitIUserUserIdOrUsernameOrPassword;

export interface IPasswordReset {
  password: string;
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
export interface PickInstanceTypeTypeofRoleModelRoleIdOrRoleNameOrRoleKeyOrOrderNumOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
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
}

export interface IRoleWithUsers {
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
  users: IUser[];
}

export interface IResponseIRoleWithUsersArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IRoleWithUsers[];
}

export type IRole =
  PickInstanceTypeTypeofRoleModelRoleIdOrRoleNameOrRoleKeyOrOrderNumOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

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
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitIRoleRoleId = PickIRoleExcludeKeysRoleId;

export type IRoleCreate = OmitIRoleRoleId;

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
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitIRoleRoleIdOrRoleKey = PickIRoleExcludeKeysRoleIdOrRoleKey;

export type IRoleUpdate = OmitIRoleRoleIdOrRoleKey;

/** From T, pick a set of properties whose keys are in the union K */
export interface PickIMenuMenuIdOrPerms {
  menuId: string;
  perms: string;
}

export interface IResponsePickIMenuMenuIdOrPermsArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: PickIMenuMenuIdOrPerms[];
}

export interface IUserWithRoles {
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
  roles: IRole[];
}

export interface IResponseIUserWithRolesArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IUserWithRoles[];
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickInstanceTypeTypeofMenuModelMenuIdOrMenuNameOrParentIdOrOrderNumOrIconOrITypeOrPathOrRedirectOrComponentOrHiddenOrLayoutOrPermsOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
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
  menuId: string;
  menuName: string;
  parentId: string;
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
  PickInstanceTypeTypeofMenuModelMenuIdOrMenuNameOrParentIdOrOrderNumOrIconOrITypeOrPathOrRedirectOrComponentOrHiddenOrLayoutOrPermsOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

export interface IResponseIMenuArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IMenu[];
}

export type DataTreeIMenu = IMenu & {
  children?: IMenu[];
  /** @format double */
  level?: number;
};

export interface IResponseDataTreeIMenuArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: DataTreeIMenu[];
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
  menuName: string;
  parentId: string;
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

export type IMenuCreate = OmitIMenuMenuId;

export type IMenuUpdate = OmitIMenuMenuId;

/** From T, pick a set of properties whose keys are in the union K */
export interface PickInstanceTypeTypeofLocaleModelLocaleIdOrLabelOrLangcodeOrMomentCodeOrIconOrOrderNumOrIsDefaultOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
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
  icon: string;
  /** @format double */
  localeId: number;
  label: string;
  langcode: string;
  momentCode: string;
  isDefault: 0 | 1;
}

export type ILocale =
  PickInstanceTypeTypeofLocaleModelLocaleIdOrLabelOrLangcodeOrMomentCodeOrIconOrOrderNumOrIsDefaultOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

export interface IResponseILocaleArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: ILocale[];
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickILocaleLangcodeOrMomentCodeOrIconOrLabelOrIsDefault {
  icon: string;
  label: string;
  langcode: string;
  momentCode: string;
  isDefault: 0 | 1;
}

export type IAvailableLocale = PickILocaleLangcodeOrMomentCodeOrIconOrLabelOrIsDefault;

export interface IResponseIAvailableLocaleArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IAvailableLocale[];
}

export interface IResponseILocale {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: ILocale;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickILocaleExcludeKeysLocaleId {
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
  icon: string;
  label: string;
  langcode: string;
  momentCode: string;
  isDefault: 0 | 1;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitILocaleLocaleId = PickILocaleExcludeKeysLocaleId;

export type ILocaleCreate = OmitILocaleLocaleId;

export type ILocaleUpdate = OmitILocaleLocaleId;

/** From T, pick a set of properties whose keys are in the union K */
export interface PickInstanceTypeTypeofLocaleSourceModelSrcIdOrSourceOrContextOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  /** @format double */
  srcId: number;
  source: string;
  context: string;
}

export type ILocaleSource =
  PickInstanceTypeTypeofLocaleSourceModelSrcIdOrSourceOrContextOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

export interface IResponseILocaleSource {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: ILocaleSource;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickILocaleSourceExcludeKeysSrcId {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  source: string;
  context: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitILocaleSourceSrcId = PickILocaleSourceExcludeKeysSrcId;

/** From T, pick a set of properties whose keys are in the union K */
export interface PickILocaleLocationExcludeKeysLcIdOrSrcId {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  type: string;
  name: string;
}

/** Construct a type with the properties of T except for those in type K. */
export type OmitILocaleLocationLcIdOrSrcId = PickILocaleLocationExcludeKeysLcIdOrSrcId;

export type ILocationCreate = OmitILocaleLocationLcIdOrSrcId;

export type ISourceCreate = OmitILocaleSourceSrcId & {
  locations: ILocationCreate[];
};

/** From T, pick a set of properties whose keys are in the union K */
export interface PickInstanceTypeTypeofLocaleMessageModelSrcIdOrLangcodeOrMessageOrCustomizedOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
  status: 0 | 1;
  deleted: 0 | 1 | 9;
  createBy: string;
  /** @format date-time */
  createTime: string;
  updateBy: string;
  /** @format date-time */
  updateTime: string;
  langcode: string;
  /** @format double */
  srcId: number;
  message: string;
  customized: 0 | 1;
}

export type ILocaleMessage =
  PickInstanceTypeTypeofLocaleMessageModelSrcIdOrLangcodeOrMessageOrCustomizedOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

export interface SequelizePaginationILocaleMessage {
  items: ILocaleMessage[];
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

export interface IResponseSequelizePaginationILocaleMessage {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: SequelizePaginationILocaleMessage;
}

export type IAvailableMessage = Record<string, any>;

export interface IResponseIAvailableMessage {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IAvailableMessage;
}

/** From T, pick a set of properties whose keys are in the union K */
export interface PickInstanceTypeTypeofDictGroupModelGroupIdOrGroupNameOrParentIdOrOrderNumOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime {
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
  /** @format double */
  parentId: number;
  /** @format double */
  groupId: number;
  groupName: string;
}

export type IDictGroup =
  PickInstanceTypeTypeofDictGroupModelGroupIdOrGroupNameOrParentIdOrOrderNumOrStatusOrDeletedOrCreateByOrCreateTimeOrUpdateByOrUpdateTime;

export interface IResponseIDictGroupArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: IDictGroup[];
}

export type DataTreeIDictGroup = IDictGroup & {
  children?: IDictGroup[];
  /** @format double */
  level?: number;
};

export interface IResponseDataTreeIDictGroupArray {
  error: boolean;
  /** @format double */
  httpCode: number;
  message: string;
  data?: DataTreeIDictGroup[];
}

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
