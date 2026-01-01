import { useState, useRef, useEffect } from "react";
import NodeControls from "./NodeControls";
import "../../styles/node.css";

export default function Node({
  label,
  type,
  onAddAction,
  onAddBranch,
  onDelete,
  onUpdateLabel
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEditing = () => {
    setEditValue(label);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdateLabel(editValue.trim());
    } else {
      setEditValue(label); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(label);
      setIsEditing(false);
    }
  };

  return (
    <div className={`node node-${type}`}>
      {isEditing ? (
        <input
          ref={inputRef}
          className="node-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="node-label"
          onClick={handleStartEditing}
          title="Click to edit"
        >
          {label}
        </span>
      )}

      <NodeControls
        onAddAction={onAddAction}
        onAddBranch={onAddBranch}
        onDelete={type === "start" ? null : onDelete}
      />
    </div>
  );
}
