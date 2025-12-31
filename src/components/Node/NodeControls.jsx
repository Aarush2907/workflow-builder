export default function NodeControls({
  onAddAction,
  onAddBranch,
  onDelete
}) {
  return (
    <div className="node-controls">
      {onAddAction && (
        <button onClick={onAddAction}>+ Action</button>
      )}
      {onAddBranch && (
        <button onClick={onAddBranch}>+ Branch</button>
      )}
      {onDelete && (
        <button className="danger" onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
} 