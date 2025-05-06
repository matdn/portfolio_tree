export class ArrayUtils {

    public static GetRandomValue<T>(tab: Array<T>): T {
        const index = Math.floor(Math.random() * tab.length);
        return tab[index];
    }
    
}