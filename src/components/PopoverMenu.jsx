export default function PopoverMenu({ position, onClose, onSelect }) {

    const style = {
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 100,
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: "140px"
    };

    const itemStyle = {
        padding: "8px 12px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "13px",
        color: "#334155",
        border: "none",
        background: "transparent",
        textAlign: "left",
        transition: "background 0.2s"
    };

    return (
        <div style={style}>
            <button
                style={itemStyle}
                onMouseEnter={(e) => e.target.style.background = "#f1f5f9"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
                onClick={() => { onSelect("action"); onClose(); }}
            >
                + Add Action
            </button>
            <button
                style={itemStyle}
                onMouseEnter={(e) => e.target.style.background = "#f1f5f9"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
                onClick={() => { onSelect("branch"); onClose(); }}
            >
                + Add Condition
            </button>
            <div style={{ height: "1px", background: "#e2e8f0", margin: "4px 0" }}></div>
            <button
                style={{ ...itemStyle, color: "#ef4444" }}
                onMouseEnter={(e) => e.target.style.background = "#fef2f2"}
                onMouseLeave={(e) => e.target.style.background = "transparent"}
                onClick={() => { onSelect("end"); onClose(); }}
            >
                ⏹ End Flow
            </button>
        </div>
    );
}
