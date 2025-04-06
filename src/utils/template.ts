/**
 * Replaces placeholders in a string with values from the provided context
 * @param context The context object containing values to be used in the template
 * @param template The string template containing placeholders in the format {{path.to.property}}
 * @returns The processed string with placeholders replaced by values
 *
 * @example
 * const result = template({settings: {name: "roberto"}}, "Hola {{settings.name}}"); // returns "Hola roberto"
 */
export function template(context: Record<string, unknown>, template: string): string {
  // Replace all placeholders in the format {{path.to.property}}
  return template.replace(/\{\{([^}]+)\}\}/g, (_, path: string) => {
    // Split the path and navigate through the context object
    const properties = path.trim().split('.');
    let value: unknown = context;

    for (const prop of properties) {
      if (value === undefined || value === null) return '';
      if (typeof value === 'object' && prop in value) {
        value = (value as Record<string, unknown>)[prop];
      } else {
        return '';
      }
    }

    return value !== undefined ? String(value) : '';
  });
}
