import Node from "./Node/Node";

/**
 * Recursive node renderer
 * Renders a node and then its children
 */
export default function RenderNode({ nodeId, nodes }) {
  const node = nodes[nodeId];

  if (!node) return null;

  return (
    <div className="node-wrapper">
      <Node label={node.label} type={node.type} />

      {/* Render children (for now, only 'next') */}
      {node.next && node.next.length > 0 && (
        <div className="node-children">
          {node.next.map((childId) => (
            <RenderNode
              key={childId}
              nodeId={childId}
              nodes={nodes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
