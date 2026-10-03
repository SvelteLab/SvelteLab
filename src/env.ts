import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	POCKETBASE_URL: { static: true },
	GITHUB_TOKEN: { static: true },
	PUBLIC_GITHUB_REDIRECT_URI: { public: true, static: true },
});
