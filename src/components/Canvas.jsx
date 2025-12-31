import { useWorkflow } from "../hooks/useWorkflow";
import "../styles/canvas.css";

export default function Canvas() {
  const { state } = useWorkflow();
  return (
    <div className="canvas">
      <h1>Workflow Builder</h1>

      {/* Temporary: show workflow state */}
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
