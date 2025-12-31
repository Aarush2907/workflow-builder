import "../../styles/node.css"

export default function Node(label , type){
    return(

    <div className={`node node-${type}`}>
      <span className="node-label">{label}</span>
    </div>

    );
}