import childProcess from 'child_process';

// modified version of this gist https://gist.github.com/tknickman/bc63ec30bec6366e1552ff8a37299db5

// https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel
const ABORT_BUILD_CODE = 0;
const CONTINUE_BUILD_CODE = 1;

const continue_build = () => process.exit(CONTINUE_BUILD_CODE);
const abort_build = () => process.exit(ABORT_BUILD_CODE);

const step_check = () => {
	// get all file names changed in last commit
	const file_name_list = childProcess
		.execSync('git diff --name-only HEAD~1')
		.toString()
		.trim()
		.split('\n');

	// check if every file is in the docs folder
	const should_build = !file_name_list.every((file) => file.startsWith(`docs/`));

	if (should_build) {
		return continue_build();
	}

	return abort_build();
};

step_check();
