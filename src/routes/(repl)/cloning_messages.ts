const cloning_messages = [
	'Cloning repo...please hold all applause until the cloning process is complete.',
	"Copying files...don't worry, I won't tell your antivirus.",
	'Commencing clone sequence, prepare for awesomeness.',
	'Cloning in progress...insert coffee to continue.',
	"Hold onto your hats, we're about to clone a repo!",
	'Cloning...because CTRL+C, CTRL+V is too mainstream.',
	"Cloning...because I couldn't find the 'Download Code' button.",
	'Clone me maybe? Na na na na na na na na na na.',
	'Cloning in progress...grab a drink and let me do the work.',
	"I'm not saying I'm the best at cloning, but I am saying I'm not the worst.",
	"Cloning in progress...it's like copying, but with more magic.",
	"Hold your horses, we're about to clone this repo at warp speed.",
	'Commencing cloning process...may the forks be with you.',
	"Hold onto your hats, we're about to clone this repo at ludicrous speed!",
	'Cloning...because nobody likes to be the only one without the latest code.',
	'Cloning in progress...time for a coffee break.',
	"Cloning...because 'git pull' just doesn't have the same ring to it.",
	"Cloning in progress...it's like watching paint dry, but with code.",
];

export function get_random_cloning_message() {
	return cloning_messages[Math.floor(Math.random() * cloning_messages.length)];
}
