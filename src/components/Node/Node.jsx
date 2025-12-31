import NodeControls from "./NodeControls";
import "../../styles/node.css";

/**
 * Base Node component
 */
export default function Node({ label, type, onAdd }) {
  return (
    <div className={`node node-${type}`}>
      <span className="node-label">{label}</span>

      {onAdd && <NodeControls onAdd={onAdd} />}
    </div>
  );
}
