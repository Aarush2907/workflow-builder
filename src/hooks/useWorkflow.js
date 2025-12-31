import { useReducer } from "react";
import { generateNodeId } from "../utils/idGenerator";


const initialState = {
    nodes : {
        start : {
           id: "start",
           type: "start",
           label: "start",
           next:[] 
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
            next: [newNodeId]
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

  // Handle Action deletion
  if (nodeToDelete.type === "action") {
    const childIds = nodeToDelete.next || [];

    // Parent is action/start
    if (parentNode.next) {
      parentNode.next = parentNode.next
        .filter(id => id !== nodeId)
        .concat(childIds);
    }

    // Parent is branch
    if (parentNode.type === "branch") {
      for (const key in parentNode.branches) {
        if (parentNode.branches[key] === nodeId) {
          parentNode.branches[key] = childIds[0] || null;
        }
      }
    }
  }

  // Handle Branch deletion
  if (nodeToDelete.type === "branch") {
    const branchChildren = Object.values(nodeToDelete.branches)
      .filter(Boolean);

    if (parentNode.next) {
      parentNode.next = parentNode.next
        .filter(id => id !== nodeId)
        .concat(branchChildren);
    }
  }

  delete nodesCopy[nodeId];

  return {
    ...state,
    nodes: nodesCopy
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