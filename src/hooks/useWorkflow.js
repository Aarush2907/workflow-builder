import { useReducer } from "react";
import { generateNodeId } from "../utils/idGenerator";


const initialState = {
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
            label: "New Action",
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
            label: "New Action",
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
          // If parent is branch, we need to check branches as well because 
          // a branch node can be a parent in two ways: via 'next' (unlikely for branch?) 
          // or via 'branches'. The search logic above found it via one of them.
          // BUT: The search logic priority: 
          // 1. node.next.includes(nodeId)
          // 2. node.branches...

          // If we found it via 'next', we updated 'next' above.
          // If we found it via 'branches', we need to update 'branches'.

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

export function useWorkflow() {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  return { state, dispatch };
}