import fs from 'fs';

class Logger {
  public static fileStatus: string;
  private static filePath: string;

  public static init(): Logger {
    const fileName = new Date().toISOString();
    Logger.filePath = `../logs/${fileName}.log`

    try {
      fs.writeFileSync(Logger.filePath, '');

      console.log(`[Logger] Created log file: ${Logger.filePath.slice(2)}`);
    } catch (err) {
      console.log('[Logger] Error creating log file ', err);
    }

    return Logger;
  }

  private static append(type: string, text: string) {
    try {
      fs.appendFileSync(Logger.filePath, `[${type}] ${text} | ${new Date().toISOString()}`)
    } catch (err) {
      console.log('[Logger] File append error ', err);
    }
  }

  public static log(text: string) {
    Logger.append('INFO', text);
  }

  public static warn(text: string) {
    Logger.append('warn', text);
  }

  public static error(text: string) {
    Logger.append('error', text);
  }
}

const logger = Logger.init();

export default Logger;