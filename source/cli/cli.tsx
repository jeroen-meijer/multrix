#!/usr/bin/env node
import meow from 'meow';

export const createCli = () =>
	meow(
		`
A CLI for running multiple commands in parallel

Usage

To run multiple commands in parallel, provide the commands as arguments:
	$ multrix <command1> <command2> <command3>

To run the same command in multiple directories, use the --dirs flag:
  $ multrix --dirs=<dir1>,<dir2>,<dir3> <command>

Examples
	$ multrix --dirs project1,project2 "npm install"
`,
		{
			importMeta: import.meta,
			allowUnknownFlags: false,
			flags: {
				dirs: {
					type: 'string',
					isRequired: false,
					default: '',
					alias: 'd',
				},
			},
		},
	);

export type Cli = ReturnType<typeof createCli>;
export type RawArgs = Cli['flags'];
