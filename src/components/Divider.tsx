"use client"
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";

interface DividerProps {
    parentRef : any,
    ratio: number,
    setRatio : Dispatch<SetStateAction<number>>
}

const Divider = ({ parentRef, ratio, setRatio } : DividerProps) => {
    const [dividerX, setDividerX] = useState<number>(ratio * 100)
    const dragging = useRef(false);


    const handleMouseDown = () => {
        dragging.current = true;
    };

    const handleMouseUp = () => {
        dragging.current = false;
    };

  useEffect(() => {
    const handleMouseMove = (e : MouseEvent) => {
        if (!dragging.current) return;

        const rect = parentRef.current.getBoundingClientRect();

        let newRatio = (e.clientX - rect.left) / rect.width;


        // clamp between 10% and 90%
        newRatio = Math.max(0.1, Math.min(newRatio, 0.9));
        setRatio(newRatio);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div       
    onMouseDown={handleMouseDown}
      className="absolute top-0 h-full w-1 bg-emerald-700 cursor-col-resize"
      style={{ left: `${ratio * 100}%` }}>
        <div onMouseDown={handleMouseDown}
            className="h-full bg-gray-200 hover:bg-blue-500 transition-colors 250s">
        </div>

    </div>
  );
};

export default Divider;