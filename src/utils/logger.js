import chalk from 'chalk';

class Logger {
    static formatTime() {
        const d = new Date();
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
    }

    debug(msg) { console.log(`[${Logger.formatTime()}] [${chalk.magenta('DEBUG')}] -> ${msg}`); }
    info(msg) { console.log(`[${Logger.formatTime()}] [${chalk.blue('INFO')}] -> ${msg}`); }
    success(msg) { console.log(`[${Logger.formatTime()}] [${chalk.green('SUCCESS')}] -> ${msg}`); }
    warn(msg) { console.log(`[${Logger.formatTime()}] [${chalk.yellow('WARNING')}] -> ${msg}`); }
    error(msg) { console.error(`[${Logger.formatTime()}] [${chalk.red('ERROR')}] -> ${msg}`); }
}

const logger = new Logger();
export default logger;
