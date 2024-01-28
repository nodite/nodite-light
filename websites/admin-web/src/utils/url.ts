export function isHttp(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function isExternal(url: string): boolean {
  return isHttp(url) && !url.includes(window.location.host);
}

export function toPath(url: string): string {
  return url.replace(window.location.origin, '').split('?', 1)[0];
}

export default {
  isHttp,
  isExternal,
  toPath,
};
