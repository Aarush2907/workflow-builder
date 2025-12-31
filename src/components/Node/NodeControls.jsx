export default function NodeControls({ onAddAction, onAddBranch }) {
  return (
    <div className="node-controls">
      <button onClick={onAddAction}>+ Action</button>
      <button onClick={onAddBranch}>+ Branch</button>
    </div>
  );
}