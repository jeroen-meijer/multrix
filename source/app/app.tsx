import React from 'react';
import {Box, Text} from 'ink';
import {CommandProcess} from '../models/index.js';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import Spinner from 'ink-spinner';

export class Store {
	constructor(commands: CommandProcess[]) {
		this.commands = commands;
	}
	@observable accessor commands: CommandProcess[];

	@action startAll = () => {
		this.commands.forEach(command => command.start());
	};
}

type Props = {
	store: Store;
};

export const MultrixApp = observer(({store}: Props) => {
	return (
		<Box>
			{store.commands.map(cmd => (
				<Box key={`${cmd.command}.${cmd.workingDirectory}`}>
					{cmd.status === 'running' ? (
						<Text color="green">
							<Spinner type="dots" />
						</Text>
					) : cmd.isSuccess ? (
						<Text color="green">✓</Text>
					) : (
						<Text color="red">✗</Text>
					)}
					<Text>
						{' '}
						[{cmd.relativeWorkingDirectory}] {cmd.command}
					</Text>
				</Box>
			))}
		</Box>
	);
});
