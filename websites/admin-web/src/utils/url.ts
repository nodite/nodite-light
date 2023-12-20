export function isHttp(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function isExternal(url: string): boolean {
  return isHttp(url) && !url.includes(window.location.host);
}
