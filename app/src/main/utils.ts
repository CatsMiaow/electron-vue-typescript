/**
 * utils.ts
 */
function template(templateData: TemplateStringsArray, ...param: string[]): string {
  let output: string = '';
  for (let i: number = 0; i < param.length; i += 1) {
    output += templateData[i] + param[i];
  }
  output += templateData[param.length];

  const lines: string[] = output.split(/(?:\r\n|\n|\r)/);

  return lines.map((line: string) => line.replace(/^\s+/gm, '')).join(' ').trim();
}

export { template };
