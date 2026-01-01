
import { useRef, useState, useEffect } from "react";
import { useWorkflow } from "../hooks/useWorkflow";
import RenderNode from "./RenderNode";
import Connections from "./Connections";
import "../styles/canvas.css";

export default function Canvas() {
  const { state, dispatch, undo, redo, save, canUndo, canRedo } = useWorkflow();
  const nodeRefs = useRef(new Map());

  // Ref to track if we clicked inside a popover or node
  // Actually, we can just use a simple state in Node for popover?
  // But if we want only one popover open at a time, we might need global state.
  // For simplicity, let's keep popover state local to Node, but maybe listen for clicks on canvas to close?
  // The user request is "Interactive Node Creation... clean... pop-over".
  // Let's implement global click handler in Node or just rely on onBlur-like behavior?
  // Simpler: Just render toolbar here. Node handles its own popover.

  const registerNode = (id, element) => {
    if (element) {
      nodeRefs.current.set(id, element);
    } else {
      nodeRefs.current.delete(id);
    }
  };

  return (
    <div className="canvas">
      <h1 className="canvas-title">Workflow Builder</h1>

      <div className="toolbar">
        <button onClick={undo} disabled={!canUndo} title="Undo">
          ↩ Undo
        </button>
        <button onClick={redo} disabled={!canRedo} title="Redo">
          ↪ Redo
        </button>
        <div className="divider"></div>
        <button onClick={save} className="primary">
          💾 Save
        </button>
      </div>

      <div className="canvas-content" style={{ position: 'relative' }}>
        <Connections nodes={state.nodes} nodeRefs={nodeRefs} />

        <RenderNode
          nodeId={state.rootId}
          nodes={state.nodes}
          dispatch={dispatch}
          registerNode={registerNode}
        />
      </div>
    </div>
  );
}
