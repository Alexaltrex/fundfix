import {MutableRefObject, useEffect} from "react";

export const useOutsideButNotOnTargetClick = (
    outsideRef: MutableRefObject<any>,
    targetRef: MutableRefObject<any>,
    cb: () => void,
): void => {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (
                outsideRef.current !== null &&
                targetRef.current != null &&
                !outsideRef.current.contains(event.target) &&
                !targetRef.current.contains(event.target)
            ) {
                cb()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [outsideRef, targetRef, cb])
}