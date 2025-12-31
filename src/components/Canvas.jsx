import { useWorkflow } from "../hooks/useWorkflow";
import RenderNode from "./RenderNode";
import "../styles/canvas.css";

export default function Canvas() {
  const { state, dispatch } = useWorkflow();

  return (
    <div className="canvas">
      <h1>Workflow Builder</h1>

      <div className="canvas-content">
        <RenderNode
          nodeId={state.rootId}
          nodes={state.nodes}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}
