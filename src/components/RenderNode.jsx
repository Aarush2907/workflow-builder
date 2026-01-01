import Node from "./Node/Node";

/**
 * Recursively renders nodes
 */
export default function RenderNode({ nodeId, nodes, dispatch, registerNode }) {
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

  const addEnd = () => {
    dispatch({
      type: "ADD_END_NODE",
      payload: { parentId: nodeId }
    });
  };

  return (
    <div className="node-wrapper">
      <Node
        nodeId={nodeId}
        label={node.label}
        type={node.type}
        onAddStep={(node.type === "branch" || node.type === "end" || (node.next && node.next.length > 0)) ? null : (type) => {
          if (type === "action") addAction();
          if (type === "branch") addBranch();
          if (type === "end") addEnd();
        }}
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
        registerNode={registerNode}
      />


      {node.type !== "branch" && node.type !== "end" && node.next && node.next.length > 0 && (
        <div className="node-children">
          {node.next.map((childId) => (
            <RenderNode
              key={childId}
              nodeId={childId}
              nodes={nodes}
              dispatch={dispatch}
              registerNode={registerNode}
            />
          ))}
        </div>
      )}

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
                    registerNode={registerNode}
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
