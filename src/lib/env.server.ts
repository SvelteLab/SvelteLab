import { PUBLIC_GITHUB_REDIRECT_URI } from '$env/static/public';

// on vercel this is setupped to replace_me for every preview branch
// except hackaton.sveltelab.dev
const IS_PREVIEW = PUBLIC_GITHUB_REDIRECT_URI === 'replace_me';
export const REDIRECT_URI = IS_PREVIEW
	? `https://${process.env.VERCEL_GIT_REPO_SLUG}-git-${process.env.VERCEL_GIT_COMMIT_REF?.replace(
			'#',
			''
	  )}-sveltelab.vercel.app/redirect`
	: PUBLIC_GITHUB_REDIRECT_URI;
