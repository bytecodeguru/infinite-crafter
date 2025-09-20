const COMMANDS = new Set(['build', 'watch', 'clean', 'help']);
const FLAG_ALIASES = {
    '-w': '--watch',
    '-c': '--clean',
    '-v': '--verbose',
    '-q': '--quiet',
    '-h': '--help'
};

export function parseCommandLine(rawArgs = []) {
    const args = [...rawArgs];
    let command = null;
    const options = {
        configPath: null
    };
    const flags = {
        watch: false,
        clean: false,
        verbose: false,
        quiet: false,
        help: false,
        skipQuality: false
    };
    const errors = [];

    const consumeOptionValue = (option, index) => {
        const value = args[index + 1];
        if (!value || value.startsWith('-')) {
            errors.push(`Option ${option} expects a value`);
            return null;
        }
        return value;
    };

    for (let i = 0; i < args.length; i += 1) {
        let arg = args[i];
        if (FLAG_ALIASES[arg]) {
            arg = FLAG_ALIASES[arg];
        }

        if (!arg.startsWith('-')) {
            if (COMMANDS.has(arg)) {
                if (command && command !== arg) {
                    errors.push(`Conflicting commands: ${command} and ${arg}`);
                }
                command = arg;
            } else {
                errors.push(`Unknown command or option: ${arg}`);
            }
            continue;
        }

        if (arg === '--watch') {
            flags.watch = true;
            continue;
        }
        if (arg === '--clean') {
            flags.clean = true;
            continue;
        }
        if (arg === '--verbose') {
            flags.verbose = true;
            continue;
        }
        if (arg === '--quiet') {
            flags.quiet = true;
            continue;
        }
        if (arg === '--help') {
            flags.help = true;
            continue;
        }
        if (arg === '--skip-quality' || arg === '--no-quality') {
            flags.skipQuality = true;
            continue;
        }
        if (arg === '--config') {
            const value = consumeOptionValue('--config', i);
            if (value) {
                options.configPath = value;
                i += 1;
            }
            continue;
        }

        errors.push(`Unknown option: ${arg}`);
    }

    if (!command) {
        if (flags.help) {
            command = 'help';
        } else if (flags.clean) {
            command = 'clean';
        } else if (flags.watch) {
            command = 'watch';
        } else {
            command = 'build';
        }
    }

    if (flags.clean && command !== 'clean') {
        errors.push('The --clean option cannot be combined with other commands.');
    }

    if (flags.watch && command === 'clean') {
        errors.push('Cannot watch while cleaning.');
    }

    if (flags.quiet && flags.verbose) {
        errors.push('Cannot use --quiet and --verbose together.');
    }

    return {
        command,
        options,
        flags,
        errors
    };
}

export function applyCliOverrides(baseConfig, cli) {
    const config = JSON.parse(JSON.stringify(baseConfig));

    if (cli.flags.verbose) {
        config.logging = { ...config.logging, level: 'debug' };
    }

    if (cli.flags.quiet) {
        config.logging = { ...config.logging, level: 'warn' };
    }

    if (cli.flags.skipQuality) {
        config.quality = null;
    }

    return config;
}
