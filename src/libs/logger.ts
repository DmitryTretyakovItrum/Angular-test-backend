export class Logger {
  private static readonly locale = 'en-US';
  private static readonly timezone = (() => {
    const timezoneOffset = new Date().getTimezoneOffset();
    const absoluteOffset = Math.abs(timezoneOffset);

    const hour = new String(Math.floor(absoluteOffset / 60)).padStart(2, '0');
    const minute = new String(absoluteOffset % 60).padStart(2, '0');

    return (timezoneOffset <= 0 ? '+' : '-') + hour + ':' + minute;
  })();
  private static readonly formatters = {
    year: new Intl.DateTimeFormat(this.locale, { year: 'numeric', timeZone: this.timezone }).format,
    month: new Intl.DateTimeFormat(this.locale, { month: 'short', timeZone: this.timezone }).format,
    day: new Intl.DateTimeFormat(this.locale, { day: '2-digit', timeZone: this.timezone }).format,
    time: new Intl.DateTimeFormat(this.locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h24',
      timeZone: this.timezone
    }).format
  }
  private static readonly colors = {
    default: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
  }

  private static getLogTime(): string {
    const timestamp = Date.now();

    const year = this.formatters.year(timestamp);
    const month = this.formatters.month(timestamp);
    const day = this.formatters.day(timestamp);
    const time = this.formatters.time(timestamp);
    const timezone = 'GMT' + this.timezone;

    return `[${day}-${month}-${year} ${time} ${timezone}]`;
  }

  public static l(...message: any[]): void {
    console.log(this.colors.magenta + this.getLogTime() + this.colors.cyan, ...message, this.colors.default);
  }

  public static i(...message: any[]): void {
    console.log(this.colors.magenta + this.getLogTime() + this.colors.cyan, ...message, this.colors.default);
  }

  public static w(...message: any[]): void {
    console.warn(this.colors.magenta + this.getLogTime() + this.colors.yellow, ...message, this.colors.default)
  }

  public static e(...message: any[]): void {
    console.error(this.colors.magenta + this.getLogTime() + this.colors.red, ...message, this.colors.default)
  }

  public static EtoE<T>(value: T): T {
    if (value instanceof Promise) {
      value.then((value) => console.log(this.colors.magenta + this.getLogTime() + this.colors.default, value));
    } else {
      console.log(this.colors.magenta + this.getLogTime() + this.colors.default, value);
    }
    return value;
  }
}

export default Logger;