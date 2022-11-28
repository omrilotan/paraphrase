/**
 * Is this a basic object?
 * @param  {any} obj Target to test
 * @return {boolean} true if object
 */
export const isObject = (obj: any): boolean => `${obj}` === "[object Object]";
