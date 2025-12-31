let counter = 1;

export function generateNodeId(prefix = "node") {
  return `${prefix}-${counter++}`;
}