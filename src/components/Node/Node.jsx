import NodeControls from "./NodeControls";
import "../../styles/node.css";

export default function Node({
  label,
  type,
  onAddAction,
  onAddBranch,
  onDelete
}) {
  return (
    <div className={`node node-${type}`}>
      <span className="node-label">{label}</span>

      {type !== "start" && (
        <NodeControls
          onAddAction={onAddAction}
          onAddBranch={onAddBranch}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
