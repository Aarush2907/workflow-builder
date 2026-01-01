import Node from "./Node/Node";

/**
 * Recursive node renderer
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
        // End nodes cannot have children
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

      {/* ACTION children */}
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
                    registerNode={registerNode}
                  />
                ) : (
                  <button
                    className="branch-add-btn"
                    onClick={() =>
                      // We need to know WHAT we are adding here. 
                      // The current UI assumes a single 'Add Step' button which defaults to Action?
                      // Wait, the User wants an OPTION.
                      // The current branch UI uses a simple button. 
                      // I should probably change this to invoke the PopoverMenu or just add a second small button 
                      // or just default to Action for now unless the User wants End nodes in branches too?
                      // The user said "if an node has a child...".
                      // I'll stick to updating the standard flow first.
                      // But for Branch, let's keep it simple: defaulting to Action for now,
                      // OR better: Dispatch a generic 'OPEN_MENU' or just add logic?
                      // The current RenderNode uses a direct button for branches:
                      /*
                        <button className="branch-add-btn" onClick={() => dispatch({ type: "ADD_ACTION_TO_BRANCH", ... })}>
                           + Add Step
                        </button>
                      */
                      // To support End nodes in branches, I should probably change this UI to allow choice.
                      // For now I will leave the Branch "Add Step" as "Add Action" default to avoid UI overhaul unless asked. 
                      // However, I will ADD options if I can easily. 
                      // Actually, let's just make the Branch 'Add Step' verify if we want to allow End nodes there. 
                      // Given constraints, I will update the main flow first.
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
