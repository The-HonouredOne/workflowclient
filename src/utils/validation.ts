export const validateWorkflow = (nodes: any[], edges: any[]) => {
  const errors: string[] = [];

  if (!nodes.some((n) => n.type === "inputNode"))
    errors.push("At least one Input node required");

  if (!nodes.some((n) => n.type === "outputNode"))
    errors.push("At least one Output node required");

  if (edges.length < nodes.length - 1)
    errors.push("All nodes must be connected");

  const graph: Record<string, string[]> = {};
  edges.forEach((e) => {
    graph[e.source] = [...(graph[e.source] || []), e.target];
  });

  const visited = new Set();
  const stack = new Set();

  const hasCycle = (node: string): boolean => {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const n of graph[node] || []) {
      if (hasCycle(n)) return true;
    }

    stack.delete(node);
    return false;
  };

  if (nodes.some((n) => hasCycle(n.id)))
    errors.push("Circular connections detected");

  return errors;
};
