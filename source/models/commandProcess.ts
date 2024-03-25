import * as childProcess from 'child_process';
import {action, makeObservable} from 'mobx';
import path from 'path';

export class CommandProcess {
	public command: string;
	public workingDirectory: string;
	public status: 'idle' | 'running' | 'done' = 'idle';
	public output: {type: 'stdout' | 'stderr'; data: string}[] = [];
	public exitCode: number | null = null;

	private _process: childProcess.ChildProcessWithoutNullStreams | null = null;

	constructor(command: string, working_directory: string) {
		this.command = command;
		this.workingDirectory = working_directory;

		makeObservable(this, {
			command: true,
			workingDirectory: true,
			status: true,
			output: true,
			exitCode: true,
		});
	}

	@action public start(): void {
		if (this.status === 'running') {
			return;
		}

		this.status = 'running';
		this.output = [];
		this.exitCode = null;

		this._process = childProcess.spawn('bash', ['-c', this.command], {
			cwd: this.workingDirectory,
		});
		this._process = this._process
			.on(
				'exit',
				action('onExit', exitCode => {
					this.exitCode = exitCode;
					this.status = 'done';
				}),
			)
			.on(
				'error',
				action('onError', error => {
					this.exitCode = 1;
					this.status = 'done';
					this.output.push({type: 'stderr', data: error.message});
				}),
			)
			.on(
				'close',
				action('onClose', exitCode => {
					this.exitCode = exitCode;
					this.status = 'done';
				}),
			)
			.on(
				'disconnect',
				action('onDisconnect', () => {
					this.exitCode = 1;
					this.status = 'done';
				}),
			);

		this._process.stdout.on(
			'data',
			action('onStdout', data => {
				this.output.push({type: 'stdout', data: data.toString()});
			}),
		);
		this._process.stderr.on(
			'data',
			action('onStderr', data => {
				this.output.push({type: 'stderr', data: data.toString()});
			}),
		);
	}

	public stop() {
		if (!!this._process) {
			this._process.kill();
			this._process = null;
		}
	}

	get relativeWorkingDirectory(): string {
		const cwd = process.cwd();
		const relativePath = path.relative(cwd, this.workingDirectory);
		if (relativePath.length === 0) {
			return '.';
		}

		return relativePath;
	}

	get fullOutput(): string {
		return this.output.map(o => o.data).join('');
	}

	get isSuccess(): boolean {
		return this.exitCode === 0;
	}
}
