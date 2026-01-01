import { useRef } from "react";
import { useWorkflow } from "../hooks/useWorkflow";
import RenderNode from "./RenderNode";
import Connections from "./Connections";
import "../styles/canvas.css";

export default function Canvas() {
  const { state, dispatch } = useWorkflow();
  const nodeRefs = useRef(new Map());

  const registerNode = (id, element) => {
    if (element) {
      nodeRefs.current.set(id, element);
    } else {
      nodeRefs.current.delete(id);
    }
  };

  return (
    <div className="canvas">
      <h1>Workflow Builder</h1>

      <div className="canvas-content" style={{ position: 'relative' }}>
        <Connections nodes={state.nodes} nodeRefs={nodeRefs} />

        <RenderNode
          nodeId={state.rootId}
          nodes={state.nodes}
          dispatch={dispatch}
          registerNode={registerNode}
        />
      </div>
    </div>
  );
}
