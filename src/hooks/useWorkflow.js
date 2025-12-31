import { useReducer } from "react";

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


    
    default:
      return state;
  }
}

export function useWorkflow() {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  return { state, dispatch };
}