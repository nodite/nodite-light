export const permToCasbinPolicy = (perm: string): string[] => {
  const permParts = perm.split(':');

  const dom = permParts.shift();
  const act = permParts.pop();
  const obj = permParts.join(':');

  return [dom, obj, act];
};

export default {};
