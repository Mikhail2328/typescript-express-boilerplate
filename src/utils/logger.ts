import chalk from 'chalk';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  HTTP = 3,
  DEBUG = 4,
}

export interface LoggerConfig {
  level: LogLevel;
  enableColors: boolean;
  enableTimestamps: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableColors: true,
      enableTimestamps: true,
      ...config,
    };
  }

  private getTimestamp(): string {
    if (!this.config.enableTimestamps) return '';
    const now = new Date();
    return `[${now.toISOString()}]`;
  }

  private formatMessage(level: string, tag: string, message: string, color: chalk.Chalk): string {
    const timestamp = this.getTimestamp();
    const tagFormatted = tag ? `[${tag}]` : '';
    
    if (this.config.enableColors) {
      return `${chalk.gray(timestamp)} ${color(`[${level}]`)} ${chalk.cyan(tagFormatted)} ${message}`;
    }
    
    return `${timestamp} [${level}] ${tagFormatted} ${message}`;
  }

  private log(level: LogLevel, levelName: string, tag: string, message: string, color: chalk.Chalk): void {
    if (level > this.config.level) return;
    
    const formattedMessage = this.formatMessage(levelName, tag, message, color);
    
    if (level === LogLevel.ERROR) {
      console.error(formattedMessage);
    } else if (level === LogLevel.WARN) {
      console.warn(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }

  error(message: string, tag: string = ''): void {
    this.log(LogLevel.ERROR, 'ERROR', tag, message, chalk.red);
  }

  warn(message: string, tag: string = ''): void {
    this.log(LogLevel.WARN, 'WARN', tag, message, chalk.yellow);
  }

  info(message: string, tag: string = ''): void {
    this.log(LogLevel.INFO, 'INFO', tag, message, chalk.blue);
  }

  http(message: string, tag: string = ''): void {
    this.log(LogLevel.HTTP, 'HTTP', tag, message, chalk.green);
  }

  debug(message: string, tag: string = ''): void {
    this.log(LogLevel.DEBUG, 'DEBUG', tag, message, chalk.magenta);
  }

  // Convenience methods for common tags
  server(message: string): void {
    this.info(message, 'SERVER');
  }

  database(message: string): void {
    this.info(message, 'DATABASE');
  }

  auth(message: string): void {
    this.info(message, 'AUTH');
  }

  api(message: string): void {
    this.info(message, 'API');
  }

  security(message: string): void {
    this.warn(message, 'SECURITY');
  }
}

// Create default logger instance
const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableColors: process.env.NODE_ENV !== 'production',
  enableTimestamps: true,
});

export default logger;
export { Logger };