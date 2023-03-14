import { PUBLIC_GITHUB_REDIRECT_URI } from '$env/static/public';

const IS_PREVIEW = import.meta.env.VERCEL_ENV === 'preview';
export const REDIRECT_URI = IS_PREVIEW ? import.meta.env.VERCEL_URL : PUBLIC_GITHUB_REDIRECT_URI;
