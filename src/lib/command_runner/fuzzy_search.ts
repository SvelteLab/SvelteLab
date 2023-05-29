import type { Command } from '$lib/types';
import { byLengthAsc, byStartAsc, extendedMatch, Fzf } from 'fzf';

export const fuzzy_search_command = (items: Command[], search: string) =>
	new Fzf(items, {
		selector: ({ category, title, subtitle, command, seo }: Command) =>
			[command, title, subtitle, category, seo].join(' '),
		tiebreakers: [byLengthAsc, byStartAsc],
		limit: 50,
		casing: 'case-insensitive',
		match: extendedMatch,
	})
		.find(search)
		.map((res) => res.item);
