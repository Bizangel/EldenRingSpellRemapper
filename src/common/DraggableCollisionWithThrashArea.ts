import { closestCorners, rectIntersection } from "@dnd-kit/core";

export default function draggableCollisionWithThrashArea({
    droppableContainers,
    ...args
}: any) {
    // First, let's see if the `trash` droppable rect is intersecting
    const rectIntersectionCollisions = rectIntersection({
        ...args,
        droppableContainers: droppableContainers.filter(({id} : any) => id === 'delete-spell-droparea')
    });

    // Collision detection algorithms return an array of collisions
    if (rectIntersectionCollisions.length > 0) {
        // The trash is intersecting, return early
        return rectIntersectionCollisions;
    }

    // Compute other collisions
    return closestCorners({
        ...args,
        droppableContainers: droppableContainers.filter(({id} : any) => id !== 'delete-spell-droparea')
    });
};
