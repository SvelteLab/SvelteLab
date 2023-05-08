import childProcess from 'child_process';

// modified version of this gist https://gist.github.com/tknickman/bc63ec30bec6366e1552ff8a37299db5

// https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel
const ABORT_BUILD_CODE = 0;
const CONTINUE_BUILD_CODE = 1;

const continueBuild = () => process.exit(CONTINUE_BUILD_CODE);
const abortBuild = () => process.exit(ABORT_BUILD_CODE);

const stepCheck = () => {
	// get all file names changed in last commit
	const fileNameList = childProcess
		.execSync('git diff --name-only HEAD~1')
		.toString()
		.trim()
		.split('\n');

	// check if every file is in the docs folder
	const shouldBuild = !fileNameList.every((file) => file.startsWith(`docs/`));

	if (shouldBuild) {
		return continueBuild();
	}

	return abortBuild();
};

stepCheck();
