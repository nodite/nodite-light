import { AuthorizedRequest } from '@nodite-light/admin-auth/lib/interfaces/authorizedRequest';
import { BaseModel as Model } from '@nodite-light/admin-database/lib/nodite-sequelize/model';
import httpContext from 'express-http-context';
import lodash from 'lodash';
import type { BuildOptions, CreationAttributes, ModelStatic } from 'sequelize/types/model';

export abstract class BaseModel extends Model {
  /**
   * Override build method.
   */
  public static build<M extends Model>(
    this: ModelStatic<M>,
    record?: CreationAttributes<M>,
    options?: BuildOptions,
  ): M {
    const user = httpContext.get('user') as AuthorizedRequest['user'];

    const newRecord = { ...record };

    // create by.
    if (options?.isNewRecord === true) {
      lodash.set(
        newRecord,
        'createBy',
        lodash.get(newRecord, 'createBy', user?.username || 'unknown'),
      );
    }

    // update by.
    lodash.set(
      newRecord,
      'updateBy',
      lodash.get(newRecord, 'updateBy', user?.username || 'unknown'),
    );

    return super.build<M>(record, options);
  }
}

export default {};
