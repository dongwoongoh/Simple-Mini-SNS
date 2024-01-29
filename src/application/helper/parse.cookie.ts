import { ForbiddenException } from '@nestjs/common';

export function parseCookie(cookieString) {
    try {
        const parts = cookieString.split(';')[0];
        const pair = parts.split('=');
        const cookie = {};
        cookie[pair[0].trim()] = pair[1].trim();
        return cookie;
    } catch (error) {
        if (error instanceof Error) {
            throw new ForbiddenException();
        }
    }
}
