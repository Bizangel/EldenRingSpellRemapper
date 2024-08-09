import { useDroppable } from "@dnd-kit/core";
import thrashIcon from "../assets/trash.svg"

function DroppableThrashArea({isDragActive} : {isDragActive: boolean}) {
    const {setNodeRef, isOver} = useDroppable({
      id: 'delete-spell-droparea',
    });
    return (
      <div ref={setNodeRef}
        style={{opacity: isDragActive ? 1 : 0}}
        className={`delete-spell-area ${isOver ? "over" : ""}`}>
        <img src={thrashIcon} className="responsive-image"/>
      </div>
    );
}

export default DroppableThrashArea;