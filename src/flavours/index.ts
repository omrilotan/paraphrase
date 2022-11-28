export const flavours: Record<string, RegExp> = {
  /**
   * Template: 'Hello, ${name}'
   */
  dollar: /\${([^{}]*)}/gm,
  /**
   * Template: 'Hello, {{name}}'
   */
  double: /{{([^{}]*)}}/gm,
  /**
   * Template: 'Hello, {name}'
   */
  single: /{([^{}]*)}/gm,
  /**
   * Template: 'Hello, #{name}'
   */
  hash: /#{([^{}]*)}/gm,
  /**
   * Template: 'Hello, %{name}'
   */
  percent: /%{([^{}]*)}/gm,
};
