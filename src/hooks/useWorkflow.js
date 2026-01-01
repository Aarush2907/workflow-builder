
import { useReducer, useCallback } from "react";
import { generateNodeId } from "../utils/idGenerator";

const initialWorkflowState = {
  nodes: {
    start: {
      id: "start",
      type: "start",
      label: "start",
      next: []
    }
  },
  rootId: "start"
};

function workflowReducer(state, action) {
  switch (action.type) {
    case "ADD_ACTION_NODE": {
      const { parentId } = action.payload;
      const newNodeId = generateNodeId("action");

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [newNodeId]: {
            id: newNodeId,
            type: "action",
            label: "Action",
            next: []
          },
          [parentId]: {
            ...state.nodes[parentId],
            next: [...state.nodes[parentId].next, newNodeId]
          }
        }
      };
    }

    case "ADD_BRANCH_NODE": {
      const { parentId } = action.payload;
      const newNodeId = generateNodeId("branch");

      const parentNode = state.nodes[parentId];

      return {
        ...state,
        nodes: {
          ...state.nodes,

          [newNodeId]: {
            id: newNodeId,
            type: "branch",
            label: "Condition",
            branches: {
              true: null,
              false: null
            }
          },

          [parentId]: {
            ...parentNode,
            next: [...(parentNode.next || []), newNodeId]
          }
        }
      };
    }

    case "ADD_END_NODE": {
      const { parentId } = action.payload;
      const newNodeId = generateNodeId("end");

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [newNodeId]: {
            id: newNodeId,
            type: "end",
            label: "End",
            next: [] // End nodes technically don't have next, but keeping empty array is safe for consistency
          },
          [parentId]: {
            ...state.nodes[parentId],
            next: [...(state.nodes[parentId].next || []), newNodeId]
          }
        }
      };
    }

    case "ADD_ACTION_TO_BRANCH": {
      const { branchId, branchKey } = action.payload;
      const newNodeId = generateNodeId("action");

      const branchNode = state.nodes[branchId];

      return {
        ...state,
        nodes: {
          ...state.nodes,

          [newNodeId]: {
            id: newNodeId,
            type: "action",
            label: "Action",
            next: []
          },

          [branchId]: {
            ...branchNode,
            branches: {
              ...branchNode.branches,
              [branchKey]: newNodeId
            }
          }
        }
      };
    }

    case "ADD_END_TO_BRANCH": {
      const { branchId, branchKey } = action.payload;
      const newNodeId = generateNodeId("end");

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [newNodeId]: {
            id: newNodeId,
            type: "end",
            label: "End",
            next: []
          },
          [branchId]: {
            ...state.nodes[branchId],
            branches: {
              ...state.nodes[branchId].branches,
              [branchKey]: newNodeId
            }
          }
        }
      };
    }

    case "DELETE_NODE": {
      const { nodeId } = action.payload;

      // Prevent deleting start node
      if (nodeId === state.rootId) return state;

      const nodesCopy = { ...state.nodes };
      let parentId = null;
      let parentNode = null;

      // Find parent node
      for (const id in nodesCopy) {
        const node = nodesCopy[id];

        // Action parent
        if (node.next?.includes(nodeId)) {
          parentId = id;
          parentNode = node;
          break;
        }

        // Branch parent
        if (node.type === "branch") {
          for (const key in node.branches) {
            if (node.branches[key] === nodeId) {
              parentId = id;
              parentNode = node;
              break;
            }
          }
        }
      }

      if (!parentNode) return state;

      const nodeToDelete = nodesCopy[nodeId];
      let updatedParentNode = { ...parentNode };

      // Handle Action deletion
      if (nodeToDelete.type === "action") {
        const childIds = nodeToDelete.next || [];

        // Parent is action/start
        if (updatedParentNode.next) {
          updatedParentNode.next = updatedParentNode.next
            .filter(id => id !== nodeId)
            .concat(childIds);
        }

        // Parent is branch
        if (updatedParentNode.type === "branch") {
          for (const key in updatedParentNode.branches) {
            if (updatedParentNode.branches[key] === nodeId) {
              updatedParentNode.branches = {
                ...updatedParentNode.branches,
                [key]: childIds[0] || null
              };
            }
          }
        }
      }

      // Handle End node deletion
      if (nodeToDelete.type === "end") {
        // Parent is action/start
        if (updatedParentNode.next) {
          updatedParentNode.next = updatedParentNode.next
            .filter(id => id !== nodeId);
        }

        // Parent is branch
        if (updatedParentNode.type === "branch") {
          for (const key in updatedParentNode.branches) {
            if (updatedParentNode.branches[key] === nodeId) {
              updatedParentNode.branches = {
                ...updatedParentNode.branches,
                [key]: null
              };
            }
          }
        }
      }

      // Handle Branch deletion
      if (nodeToDelete.type === "branch") {
        const branchChildren = Object.values(nodeToDelete.branches)
          .filter(Boolean);

        if (updatedParentNode.next) {
          updatedParentNode.next = updatedParentNode.next
            .filter(id => id !== nodeId)
            .concat(branchChildren);
        }

        // Also handle case where parent is a branch (connected via branch prop)
        if (updatedParentNode.type === 'branch') {
          for (const key in updatedParentNode.branches) {
            if (updatedParentNode.branches[key] === nodeId) {
              // If a branch is deleted, we might validly append its children? 
              // Or just nullify? The logic for 'next' concatenation suggests we keep children.
              // But for a branch slot, we can only fit one child. 
              // So we take the first child or null.
              updatedParentNode.branches = {
                ...updatedParentNode.branches,
                [key]: branchChildren[0] || null
              }
            }
          }
        }
      }

      delete nodesCopy[nodeId];

      // Update the parent in the nodes object
      nodesCopy[parentId] = updatedParentNode;

      return {
        ...state,
        nodes: nodesCopy
      };
    }

    case "UPDATE_NODE_LABEL": {
      const { nodeId, label } = action.payload;
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...state.nodes[nodeId],
            label
          }
        }
      };
    }

    default:
      return state;
  }
}

// Undo/Redo Higher Order Reducer
const undoable = (reducer) => {
  const initialState = {
    past: [],
    present: initialWorkflowState,
    future: []
  };

  return function (state = initialState, action) {
    const { past, present, future } = state;

    switch (action.type) {
      case "UNDO":
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        if (!previous) return state; // Can't undo

        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        };

      case "REDO":
        const next = future[0];
        const newFuture = future.slice(1);

        if (!next) return state; // Can't redo

        return {
          past: [...past, present],
          present: next,
          future: newFuture
        };

      default:
        // Delegate to inner reducer
        const newPresent = reducer(present, action);

        // If specific actions didn't change state, return current state
        if (present === newPresent) return state;

        return {
          past: [...past, present],
          present: newPresent,
          future: [] // Verify future is cleared on new action? Yes, standard pattern
        };
    }
  };
};

const rootReducer = undoable(workflowReducer);

export function useWorkflow() {
  const [state, dispatch] = useReducer(rootReducer, undefined, () => rootReducer(undefined, {}));

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);

  const save = useCallback(() => {
    console.log("WORKFLOW DATA:", JSON.stringify(state.present, null, 2));
    alert("Workflow saved to console!");
  }, [state.present]);

  return {
    state: state.present, // Unwrap for consumers
    dispatch,
    undo,
    redo,
    save,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  };
}
