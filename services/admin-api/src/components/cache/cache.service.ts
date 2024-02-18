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
  public clearAllCache(type: string, userId?: number): void {
    if (type === 'all') {
      this.clearMenuCache(userId);
      this.clearLocaleCache();
      this.clearPermsCache(userId);
    } else if (type === 'menu') {
      this.clearMenuCache(userId);
    } else if (type === 'locale') {
      this.clearLocaleCache();
    } else if (type === 'perms') {
      this.clearPermsCache(userId);
    } else {
      throw new Error('Invalid cache type');
    }
  }

  /**
   * Clear menu cache.
   * @param userId
   */
  @CacheClear({ hashKey: 'menu:tree', cacheKey: (args) => args[0] || '*' })
  public clearMenuCache(userId?: number): void {}

  /**
   * Clear locale cache.
   * @param langcode
   */
  @CacheClear({ hashKey: 'locale:available' })
  @CacheClear({ hashKey: 'locale:message:available', cacheKey: (args) => args[0] || '*' })
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
  @CacheClear({ hashKey: 'user:role:list', cacheKey: (args) => args[0] || '*' })
  public clearUserRoleCache(userId?: number): void {}

  /**
   * Clear role's perm cache.
   * @param roleId
   */
  @CacheClear({ hashKey: 'role:perm:list', cacheKey: (args) => args[0] || '*' })
  public clearRolePermCache(roleId?: number): void {}
}

export default CacheService;
