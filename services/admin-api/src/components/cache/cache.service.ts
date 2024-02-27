/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CacheClear } from '@nodite-light/admin-database';

import UserService from '@/components/user/user.service';

/**
 * Class CacheService.
 */
export class CacheService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Clear all cache.
   */
  public async clearAllCache(type: string, userId?: number): Promise<void> {
    if (['all', 'menu'].includes(type)) {
      this.clearMenuCache(userId);
    }

    if (['all', 'dict'].includes(type)) {
      this.clearDictCache();
    }

    if (['all', 'locale'].includes(type)) {
      this.clearLocaleCache();
    }

    if (['all', 'perms'].includes(type)) {
      await this.clearPermsCache(userId);
    }
  }

  /**
   * Clear menu cache.
   * @param userId
   */
  @CacheClear({ hashKey: 'menu:tree', cacheKey: (args) => args[0] || '*', isPattern: true })
  public clearMenuCache(userId?: number): void {}

  /**
   * Clear dict cache.
   * @param dictKey
   */
  @CacheClear({ hashKey: 'dict:group:tree' })
  @CacheClear({ hashKey: 'dict:type:query', cacheKey: (args) => args[0] || '*', isPattern: true })
  public clearDictCache(dictKey?: string): void {}

  /**
   * Clear locale cache.
   * @param langcode
   */
  @CacheClear({ hashKey: 'locale:available' })
  @CacheClear({
    hashKey: 'locale:message:available',
    cacheKey: (args) => args[0] || '*',
    isPattern: true,
  })
  public clearLocaleCache(langcode?: string): void {}

  /**
   * Clear perms cache.
   * @param userId
   */
  public async clearPermsCache(userId?: number): Promise<void> {
    this.clearUserRoleCache(userId);
    if (userId) {
      const roles = await this.userService.selectRolesWithUser(userId);
      roles.forEach((role) => this.clearRolePermCache(role.roleId));
    } else {
      this.clearRolePermCache();
    }
  }

  /**
   * Clear user's role cache.
   * @param userId
   */
  @CacheClear({ hashKey: 'user:role:list', cacheKey: (args) => args[0] || '*', isPattern: true })
  public clearUserRoleCache(userId?: number): void {}

  /**
   * Clear role's perm cache.
   * @param roleId
   */
  @CacheClear({ hashKey: 'role:perm:list', cacheKey: (args) => args[0] || '*', isPattern: true })
  public clearRolePermCache(roleId?: number): void {}
}

export default CacheService;
