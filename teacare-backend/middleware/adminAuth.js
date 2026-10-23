import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'teacare_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const activeSessions = new Map();

const isConfigured = () =>
    Boolean(
        process.env.ADMIN_USERNAME &&
        process.env.ADMIN_PASSWORD &&
        process.env.ADMIN_SESSION_SECRET &&
        process.env.ADMIN_SESSION_SECRET.length >= 32
    );

const constantTimeEqual = (left, right) => {
    const leftHash = createHash('sha256').update(left).digest();
    const rightHash = createHash('sha256').update(right).digest();
    return timingSafeEqual(leftHash, rightHash);
};

const signSession = (expiresAt, sessionId) =>
    createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
        .update(`${expiresAt}.${sessionId}`)
        .digest('base64url');

const getSessionCookie = (req) => {
    const cookie = req.headers.cookie
        ?.split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${COOKIE_NAME}=`));

    return cookie?.slice(COOKIE_NAME.length + 1);
};

const cookieOptions = () =>
    `Path=/api; HttpOnly; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

export const loginAdmin = (req, res) => {
    if (!isConfigured()) {
        return res.status(503).json({
            success: false,
            error: 'Admin login is not configured on the server.',
        });
    }

    const { username, password } = req.body ?? {};
    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        !constantTimeEqual(username.trim(), process.env.ADMIN_USERNAME) ||
        !constantTimeEqual(password, process.env.ADMIN_PASSWORD)
    ) {
        return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
    const sessionId = randomBytes(24).toString('base64url');
    for (const [id, expiry] of activeSessions) {
        if (expiry <= Math.floor(Date.now() / 1000)) activeSessions.delete(id);
    }
    activeSessions.set(sessionId, expiresAt);
    const session = `${expiresAt}.${sessionId}.${signSession(expiresAt, sessionId)}`;
    res.setHeader(
        'Set-Cookie',
        `${COOKIE_NAME}=${session}; Max-Age=${SESSION_DURATION_SECONDS}; ${cookieOptions()}`
    );
    return res.status(200).json({ success: true });
};

export const requireAdmin = (req, res, next) => {
    if (!isConfigured()) {
        return res.status(503).json({
            success: false,
            error: 'Admin login is not configured on the server.',
        });
    }

    const session = getSessionCookie(req);
    const [expiresAtText, sessionId, signature, ...extra] = session?.split('.') ?? [];
    const expiresAt = Number(expiresAtText);
    const now = Math.floor(Date.now() / 1000);

    if (
        extra.length > 0 ||
        !Number.isSafeInteger(expiresAt) ||
        expiresAt <= now ||
        expiresAt > now + SESSION_DURATION_SECONDS ||
        typeof sessionId !== 'string' ||
        activeSessions.get(sessionId) !== expiresAt ||
        typeof signature !== 'string' ||
        !constantTimeEqual(signature, signSession(expiresAt, sessionId))
    ) {
        return res.status(401).json({ success: false, error: 'Admin authentication required.' });
    }

    return next();
};

export const checkAdminSession = (req, res) =>
    res.status(200).json({ success: true });

export const logoutAdmin = (req, res) => {
    const session = getSessionCookie(req);
    const sessionId = session?.split('.')[1];
    if (sessionId) activeSessions.delete(sessionId);
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Max-Age=0; ${cookieOptions()}`);
    return res.status(200).json({ success: true });
};
