export function hasPasswordKey(obj: any): obj is { password: any } {
    return obj && typeof obj === 'object' && 'password' in obj;
}
