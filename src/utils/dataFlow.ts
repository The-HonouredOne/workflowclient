export const propagateData = (nodes: any[], edges: any[]) => {
  edges.forEach((e) => {
    const source = nodes.find((n) => n.id === e.source);
    const target = nodes.find((n) => n.id === e.target);

    if (source?.type === "inputNode" && target?.type === "outputNode") {
      target.data.value = source.data.value;
    }
  });
};
