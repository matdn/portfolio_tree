export class MouseUtils {

    public static GetMousePosition(e: Event): { x: number, y: number } | undefined {
        let position = {
            x: 0,
            y: 0
        }
        if (e instanceof MouseEvent) {
            position.x = e.clientX;
            position.y = e.clientY;
        } else if (window.TouchEvent && e instanceof TouchEvent) {
            position.x = e.touches[0].clientX;
            position.y = e.touches[0].clientY;
        }

        return position;
    }
}
