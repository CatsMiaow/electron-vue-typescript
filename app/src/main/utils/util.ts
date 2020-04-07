export type TemplateParameter = unknown[];

function template<T>(templateData: TemplateStringsArray, param: T[], delimiter: string = '\n'): string {
  let output = '';
  for (let i = 0; i < param.length; i += 1) {
    output += templateData[i] + param[i];
  }
  output += templateData[param.length];

  const lines: string[] = output.split(/(?:\r\n|\n|\r)/);

  return lines.map((text: string) => text.replace(/^\s+/gm, '')).join(delimiter).trim();
}

export function pre(templateData: TemplateStringsArray, ...param: TemplateParameter): string {
  return template(templateData, param, '\n');
}

export function line(templateData: TemplateStringsArray, ...param: TemplateParameter): string {
  return template(templateData, param, ' ');
}

export function isObject<T>(value: T): boolean {
  return value !== null && typeof value === 'object' && Array.isArray(value) === false;
}
