/**
 * @property {RegExp} dollar 'Hello, ${name}'
 * @property {RegExp} double 'Hello, {{name}}'
 * @property {RegExp} single 'Hello, {name}'
 * @property {RegExp} hash 'Hello, #{name}'
 * @property {RegExp} percent 'Hello, %{name}'
 */
export const flavours = {
  dollar: /\${([^{}]*)}/gm,
  double: /{{([^{}]*)}}/gm,
  single: /{([^{}]*)}/gm,
  hash: /#{([^{}]*)}/gm,
  percent: /%{([^{}]*)}/gm
}
