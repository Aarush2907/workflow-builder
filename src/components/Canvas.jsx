import { useWorkflow } from "../hooks/useWorkflow";
import Node from "./Node/Node";
import "../styles/canvas.css";

export default function Canvas() {
  const { state } = useWorkflow();
  const startNode = state.nodes[state.rootId];

  return (
    <div className="canvas">
      <h1>Workflow Builder</h1>

      <div className="canvas-content">
        <Node label={startNode.label} type={startNode.type} />
      </div>
    </div>
  );
}
