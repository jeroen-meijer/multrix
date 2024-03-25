export type Args =
	| {
			mode: 'commands';
			commands: string[];
			workingDirectory: string | null;
	  }
	| {
			mode: 'dirs';
			command: string;
			dirs: string[];
	  };
