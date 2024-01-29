export function parseCookie(cookieString) {
    const parts = cookieString.split(';')[0];
    const pair = parts.split('=');
    const cookie = {};
    cookie[pair[0].trim()] = pair[1].trim();
    return cookie;
}
