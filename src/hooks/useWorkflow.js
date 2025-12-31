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
    
    default:
      return state;
  }
}

export function useWorkflow() {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  return { state, dispatch };
}