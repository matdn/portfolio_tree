import { useEffect } from "react";
// import "./CustomCursor.css";

export default function CustomCursor() {
    useEffect(() => {
        const cursor = document.createElement("div");
        cursor.className = "custom-cursor";
        document.body.appendChild(cursor);

        const ring = document.createElement("div");
        ring.className = "cursor-ring";
        document.body.appendChild(ring);

        let lastX = window.innerWidth / 2;
        let lastY = window.innerHeight / 2;
        let currentX = lastX;
        let currentY = lastY;
        let lastTime = performance.now();
        let timeout: NodeJS.Timeout | null = null;

        const moveCursor = (e: MouseEvent) => {
            lastX = e.clientX;
            lastY = e.clientY;

            const now = performance.now();
            const dx = e.clientX - currentX;
            const dy = e.clientY - currentY;
            const dt = now - lastTime;
            const speed = Math.sqrt(dx * dx + dy * dy) / dt;

            const size = Math.min(60, 10 + speed * 120);
            ring.style.setProperty("--ring-size", `${size}px`);

            lastTime = now;

            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                ring.style.setProperty("--ring-size", `0px`);
            }, 1500);
        };

        const animate = () => {
            currentX += (lastX - currentX) * 0.15;
            currentY += (lastY - currentY) * 0.15;

            cursor.style.transform = `translate(${lastX}px, ${lastY}px) translate(-50%, -50%)`;
            ring.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

            requestAnimationFrame(animate);
        };

        document.addEventListener("mousemove", moveCursor);
        animate();

        return () => {
            document.removeEventListener("mousemove", moveCursor);
            cursor.remove();
            ring.remove();
        };
    }, []);

    return null;
}
