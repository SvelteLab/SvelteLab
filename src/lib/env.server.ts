import { PUBLIC_GITHUB_REDIRECT_URI } from '$env/static/public';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export const REDIRECT_URI = IS_PREVIEW
	? `https://${process.env.VERCEL_GIT_REPO_SLUG}-git-${process.env.VERCEL_GIT_COMMIT_REF?.replace(
			'#',
			''
	  )}-svelteblitz.vercel.app/redirect`
	: PUBLIC_GITHUB_REDIRECT_URI;
