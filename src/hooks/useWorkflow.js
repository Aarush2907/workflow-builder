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
    default:
      return state;
  }
}

export function useWorkflow() {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  return { state, dispatch };
}