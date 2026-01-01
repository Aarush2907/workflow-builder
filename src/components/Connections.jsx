import { useState, useLayoutEffect, useEffect } from "react";

/**
 * Renders SVG connections between nodes
 */
export default function Connections({ nodes, nodeRefs }) {
    const [lines, setLines] = useState([]);

    // Calculate lines whenever nodes or layout changes
    useLayoutEffect(() => {
        // Helper to get element coordinates
        const getCoords = (id) => {
            const el = nodeRefs.current.get(id);
            if (!el) return null;

            const rect = el.getBoundingClientRect();
            const parentRect = el.parentElement.closest('.canvas-content')?.getBoundingClientRect();

            if (!parentRect) return null;

            // Calculate relative position to canvas content
            return {
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top, // Top for incoming
                w: rect.width,
                h: rect.height,
                bottomY: rect.bottom - parentRect.top // Bottom for outgoing
            };
        };

        const newLines = [];

        // Observe all nodes for size changes
        const resizeObserver = new ResizeObserver(() => {
            // Force re-render/re-calc
            // In a real app we might want to debounce this or be more selective
            // But for this assignment, triggering a re-calc is fine.
            // We can just rely on the layout effect running again if we trigger state update?
            // Actually, we need to trigger a re-render. 
            // Let's just re-run the calculation logic.
            calculateLines();
        });

        // Cleanup previous observations
        nodeRefs.current.forEach(el => resizeObserver.observe(el));

        const calculateLines = () => {
            const calculatedLines = [];

            Object.values(nodes).forEach(node => {
                const startCoords = getCoords(node.id);
                if (!startCoords) return;

                // Connections from Actions/Start
                if (node.next) {
                    node.next.forEach(childId => {
                        const endCoords = getCoords(childId);
                        if (endCoords) {
                            calculatedLines.push({
                                id: `${node.id}-${childId}`,
                                x1: startCoords.x,
                                y1: startCoords.bottomY,
                                x2: endCoords.x,
                                y2: endCoords.y,
                                type: 'straight'
                            });
                        }
                    });
                }

                // Connections from Branches
                if (node.type === 'branch' && node.branches) {
                    Object.entries(node.branches).forEach(([key, childId]) => {
                        if (!childId) return;

                        const endCoords = getCoords(childId);
                        if (endCoords) {
                            // Find the branch label position? 
                            // For now, render curve from parent bottom to child top
                            calculatedLines.push({
                                id: `${node.id}-${childId}-${key}`,
                                x1: startCoords.x,
                                y1: startCoords.bottomY,
                                x2: endCoords.x,
                                y2: endCoords.y,
                                label: key.toUpperCase(),
                                type: 'curved'
                            });
                        }
                    });
                }
            });

            setLines(calculatedLines);
        };

        calculateLines();

        return () => resizeObserver.disconnect();
    }, [nodes, nodeRefs]);

    // Force update on window resize
    useEffect(() => {
        const handleResize = () => setLines(prev => [...prev]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <svg
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
                overflow: "visible"
            }}
        >
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                </marker>
            </defs>
            {lines.map(line => {
                // Bezier Curve Logic
                // Control points for smooth S-curve
                const controlY1 = line.y1 + 40;
                const controlY2 = line.y2 - 40;
                const path = `M ${line.x1} ${line.y1} C ${line.x1} ${controlY1}, ${line.x2} ${controlY2}, ${line.x2} ${line.y2}`;

                return (
                    <g key={line.id}>
                        <path
                            d={path}
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                        />
                        {line.label && (
                            <text
                                x={(line.x1 + line.x2) / 2}
                                y={(line.y1 + line.y2) / 2}
                                fill="#94a3b8"
                                fontSize="10"
                                textAnchor="middle"
                                fontWeight="bold"
                                dy="-5"
                                style={{ background: 'white' }}
                            >
                                {/* Background rect for text readability? SVG doesn't support background easily on text without filter or separate rect. 
                        Let's rely on the CSS label for branches instead? 
                        Actually, the user requirement 4 says "Clear labels for TRUE and FALSE"
                    */}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}
