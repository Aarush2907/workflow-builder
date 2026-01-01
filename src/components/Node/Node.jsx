import { useState, useRef, useEffect, useLayoutEffect } from "react";
import PopoverMenu from "../PopoverMenu";
import "../../styles/node.css";

export default function Node({
  nodeId,
  label,
  type,
  onDelete,
  onUpdateLabel,
  registerNode,
  onAddStep
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef(null); // specific input ref
  const nodeRef = useRef(null);  // container ref for connections

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Register node for connections
  useLayoutEffect(() => {
    if (registerNode && nodeRef.current) {
      registerNode(nodeId, nodeRef.current);
    }
    return () => {
      if (registerNode) registerNode(nodeId, null);
    }
  }, [nodeId, registerNode]);

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
    <div ref={nodeRef} className={`node node-${type}`}>
      <div className="node-content">
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

        {/* Delete Button (Top Right) */}
        {type !== "start" && (
          <button
            className="delete-btn"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete Node"
          >
            ×
          </button>
        )}
      </div>

      {/* Connection Point (Add Button) */}
      {onAddStep && (
        <div style={{ position: "relative" }}>
          <button
            className="add-point-btn"
            onClick={() => setShowPopover(!showPopover)}
            title="Add Step"
          >
            +
          </button>

          {showPopover && (
            <PopoverMenu
              position={{ x: -60, y: 15 }} // Relative to button
              onClose={() => setShowPopover(false)}
              onSelect={onAddStep}
            />
          )}
        </div>
      )}
    </div>
  );
}
