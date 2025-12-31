import NodeControls from "./NodeControls";
import "../../styles/node.css";

/**
 * Base Node component
 */
export default function Node({
  label,
  type,
  onAddAction,
  onAddBranch
}) {
  return (
    <div className={`node node-${type}`}>
      <span className="node-label">{label}</span>

      {type !== "end" && type !== "branch" && (
        <NodeControls
          onAddAction={onAddAction}
          onAddBranch={onAddBranch}
        />
      )}
    </div>
  );
}
