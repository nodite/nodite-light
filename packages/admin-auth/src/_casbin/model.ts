import { newModel } from 'casbin';

const model = newModel();

/**
 * Default RBAC model.
 * -------------------------
 * [request_definition]
 * r = sub, dom, obj, act
 * @example r = sys_user:1, admin, menu, list
 *
 * [policy_definition]
 * p = sub, dom, obj, act
 * @example p = role:1, *, *, *
 *
 * [role_definition]
 * g = _, _
 * @example g = sys_user:1, role:1
 *
 * [policy_effect]
 * e = some(where (p.eft == allow))
 * @example e = some(where (p.eft == allow))
 */
model.addDef('r', 'r', 'sub, dom, obj, act');
model.addDef('p', 'p', 'sub, dom, obj, act');
model.addDef('g', 'g', '_, _');
model.addDef('e', 'e', 'some(where (p.eft == allow))');
model.addDef(
  'm',
  'm',
  [
    'g(r.sub, p.sub)', // g(r.sub, p.sub) == true
    '(r.dom == p.dom || p.dom == "*")', // r.dom == p.dom || p.dom == "*"
    '(r.obj == p.obj || p.obj == "*")', // r.obj == p.obj || p.obj == "*"
    '(r.act == p.act || p.act == "*")', // r.act == p.act || p.act == "*"
  ].join(' && '),
);

export default model;
