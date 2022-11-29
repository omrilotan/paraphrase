interface IParaphraseOptions {
    /**
     * Should continue to resolve result string until replacements have been exhausted
     */
    recursive?: boolean;
    /**
     * Should resolve dot notation within template
     */
    resolve?: boolean;
    /**
     * Should remove unmatched template instances
     */
    clean?: boolean;
}
interface Phraser {
    (
    /**
     * Template string to parse
     */
    string: string | undefined, 
    /**
     * Data to use for interpolation, preferrably an object, but an array will work too, and a primitive values will be treated as an array of "...rest" arguments
     */
    ...data: (Record<string, any> | any)[]): string;
    patterns: RegExp[];
}
/**
 * Create new paraphrase method instance
 * @param  {...RegExp[]} replacers[] One or more patterns to use for string replacement
 * @param  {IParaphraseOptions} [options] The last argument can be an options object
 * @returns {Phraser} phraser function instance
 *
 * @example const phraser = paraphrase(/\${([^{}]*)}/gm);
 *
 * phraser('Hello, ${name}', {name: 'Martin'})
 */
export declare function paraphrase(...args: (RegExp | RegExp[] | IParaphraseOptions)[]): Phraser;
export declare const dollar: Phraser;
export declare const double: Phraser;
export declare const single: Phraser;
export declare const percent: Phraser;
export declare const hash: Phraser;
export declare const loose: Phraser;
export {};
