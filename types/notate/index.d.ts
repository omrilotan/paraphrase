/**
 * Resolve dot notation strings
 *
 * @param  {any} context Object to start notation search on (defaults to global scope)
 * @param  {string} [string=''] Dot notation representation
 * @return {any} Whatever it finds / undefined
 *
 * @example
 * const obj = {
 *   top_level: {
 *     nested: {
 *       value: 'My Value'
 *     }
 *   }
 * };
 *
 * notate(obj, 'top_level.nested.value');
 * // 'My Value'
 *
 * notate(obj, 'top_level.missing.value');
 * // undefined
 */
export declare function notate(source: any, string?: string): any;
