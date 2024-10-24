/**
 * Template: 'Hello, ${name}'
 */
export const dollarPattern = /\${([^{}]*)}/gm;

/**
 * Template: 'Hello, {{name}}'
 */
export const doublePattern = /{{([^{}]*)}}/gm;

/**
 * Template: 'Hello, {name}'
 */
export const singlePattern = /{([^{}]*)}/gm;

/**
 * Template: 'Hello, #{name}'
 */
export const hashPattern = /#{([^{}]*)}/gm;

/**
 * Template: 'Hello, %{name}'
 */
export const percentPattern = /%{([^{}]*)}/gm;
