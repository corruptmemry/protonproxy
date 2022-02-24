import * as colors from 'colors';

export function info(s: string) {
  console.info(`[${colors.blue('INFO')}] ${s}`);
}

export function custom(prefix: string, s: string) {
  console.log(`[${colors.blue(prefix)}] ${s}`);
}

export function error(s: string) {
  console.error(`[${colors.red('ERROR')}] ${s}`);
}
