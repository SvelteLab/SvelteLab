import { PUBLIC_GITHUB_REDIRECT_URI } from '$env/static/public';

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export const REDIRECT_URI = IS_PREVIEW
	? `https://${process.env.VERCEL_GIT_REPO_SLUG}-${process.env.VERCEL_GIT_COMMIT_REF?.replace(
			'#',
			''
	  )}-svelteblitz`
	: PUBLIC_GITHUB_REDIRECT_URI;
