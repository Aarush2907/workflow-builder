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
        onAddAction={node.type === "branch" ? null : addAction}
        onAddBranch={node.type === "branch" ? null : addBranch}
        onDelete={() =>
          dispatch({
            type: "DELETE_NODE",
            payload: { nodeId }
          })
        }
        onUpdateLabel={(newLabel) =>
          dispatch({
            type: "UPDATE_NODE_LABEL",
            payload: { nodeId, label: newLabel }
          })
        }
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

                {childId ? (
                  <RenderNode
                    nodeId={childId}
                    nodes={nodes}
                    dispatch={dispatch}
                  />
                ) : (
                  <button
                    className="branch-add-btn"
                    onClick={() =>
                      dispatch({
                        type: "ADD_ACTION_TO_BRANCH",
                        payload: {
                          branchId: nodeId,
                          branchKey
                        }
                      })
                    }
                  >
                    + Add Step
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
