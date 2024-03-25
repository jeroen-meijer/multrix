import {Args, RawArgs} from './index.js';

export type ValidationResult =
	| {
			isValid: true;
			args: Args;
	  }
	| {
			isValid: false;
			message: string;
	  };

const _valid = (args: Args): ValidationResult => ({
	isValid: true,
	args,
});
const _invalid = (message: string): ValidationResult => ({
	isValid: false,
	message,
});

export const validateArgs = (
	input: string[],
	flags: RawArgs,
): ValidationResult => {
	if (input.length === 0) {
		return _invalid('You must provide at least one command');
	}

	const dirs = flags.dirs.split(',').filter(Boolean);

	if (dirs.length > 1) {
		if (input.length > 1) {
			return _invalid(
				'You cannot provide multiple commands when providing multiple --dirs',
			);
		}
		return _valid({
			mode: 'dirs',
			command: input[0]!,
			dirs,
		});
	}

	return _valid({
		mode: 'commands',
		commands: input,
		workingDirectory: dirs[0] ?? null,
	});
};
