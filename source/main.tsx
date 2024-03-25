import {render} from 'ink';
import {MultrixApp, Store} from './app/index.js';
import React from 'react';
import {createCli, validateArgs} from './cli/index.js';
import {CommandProcess} from './models/index.js';
import path from 'path';

const cli = createCli();

const validation = validateArgs(cli.input, cli.flags);
if (!validation.isValid) {
	console.error(validation.message);
	console.debug({
		input: cli.input,
		flags: cli.flags,
	});
	process.exit(1);
}
const {args} = validation;

const cwd = process.cwd();

const commands =
	args.mode === 'dirs'
		? args.dirs.map(
				dir => new CommandProcess(cli.input[0]!, path.join(cwd, dir)),
		  )
		: args.commands.map(command => {
				console.log('command', command, args.workingDirectory, cwd);
				return new CommandProcess(
					command,
					args.workingDirectory != null
						? path.join(cwd, args.workingDirectory)
						: cwd,
				);
		  });

const store = new Store(commands);
store.startAll();

render(<MultrixApp store={store} />);
