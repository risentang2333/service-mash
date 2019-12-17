/**
 * 坐标点
 * @class Position
 */
export class Position{
    public x: number
    public y: number
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    clone(): Position{
        return new Position(this.x, this.y)
    }
}