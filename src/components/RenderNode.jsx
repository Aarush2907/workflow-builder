import Node from "./Node/Node";

/**
 * Recursive node renderer
 */
export default function RenderNode({ nodeId, nodes, dispatch }) {
  const node = nodes[nodeId];
  if (!node) return null;

  const addAction = () => {
    dispatch({
      type: "ADD_ACTION_NODE",
      payload: { parentId: nodeId }
    });
  };

  const addBranch = () => {
    dispatch({
      type: "ADD_BRANCH_NODE",
      payload: { parentId: nodeId }
    });
  };

  return (
    <div className="node-wrapper">
      <Node
        label={node.label}
        type={node.type}
        onAddAction={addAction}
        onAddBranch={addBranch}
      />

      {/* ACTION children */}
      {node.next && node.next.length > 0 && (
        <div className="node-children">
          {node.next.map((childId) => (
            <RenderNode
              key={childId}
              nodeId={childId}
              nodes={nodes}
              dispatch={dispatch}
            />
          ))}
        </div>
      )}

      {/* BRANCH children */}
      {node.type === "branch" && (
        <div className="branch-children">
          {Object.entries(node.branches).map(
            ([branchKey, childId]) => (
              <div key={branchKey} className="branch-column">
                <div className="branch-label">
                  {branchKey.toUpperCase()}
                </div>

                {childId && (
                  <RenderNode
                    nodeId={childId}
                    nodes={nodes}
                    dispatch={dispatch}
                  />
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
