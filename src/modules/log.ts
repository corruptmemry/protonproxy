import * as colors from 'colors';

/**
 * Info print
 *
 * @export
 * @param {string} s
 */
export function info(s: string) {
  console.info(`[${colors.blue('INFO')}] ${s}`);
}

/**
 * Custom prefix print
 *
 * @export
 * @param {string} prefix
 * @param {string} s
 */
export function custom(prefix: string, s: string) {
  console.log(`[${colors.blue(prefix)}] ${s}`);
}

/**
 * Error print
 *
 * @export
 * @param {string} s
 */
export function error(s: string) {
  console.error(`[${colors.red('ERROR')}] ${s}`);
}
