/**
 * Node controls (Add button)
 */
export default function NodeControls({ onAdd }) {
  return (
    <div className="node-controls">
      <button onClick={onAdd}>+ Add Step</button>
    </div>
  );
}
