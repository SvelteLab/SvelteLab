export const github_regex =
	/(?<owner>[^/]+)\/(?<repo>[^/]+)\/?(?:tree\/(?<branch>[^/]+))?(?<path>\/.*)?/;

export function build_import_href(value: string) {
	const info = value.match(github_regex)?.groups;
	const search_params = new URLSearchParams();
	search_params.set('provider', 'github');
	for (const group in info) {
		if (info[group]) {
			search_params.set(group, info[group]);
		}
	}
	return `/?${search_params}`;
}
