import { AuthorizedRequest } from '@nodite-light/admin-auth';
import { SequelizeModel } from '@nodite-light/admin-database';
import httpContext from 'express-http-context';
import lodash from 'lodash';
import type { BuildOptions, CreationAttributes, ModelStatic } from 'sequelize/types/model';

export default abstract class BaseModel extends SequelizeModel {
  /**
   * Override build method.
   */
  public static build<M extends SequelizeModel>(
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
