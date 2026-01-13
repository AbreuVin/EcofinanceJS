export function isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
        // 1. Split the token (Header.Payload.Signature)
        const base64Url = token.split('.')[1];

        // 2. Normalize Base64Url to Base64
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // 3. Decode the payload
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const { exp } = JSON.parse(jsonPayload);

        // 4. Check if expired (exp is in seconds, Date.now is in ms)
        if (!exp) return false; // If no expiry, assume valid
        return Date.now() >= exp * 1000;

    } catch (error) {
        console.error("Error checking token expiration:", error);
        return true; // Treat invalid format as expired
    }
}