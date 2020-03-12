/**
 * 坐标点类
 * @class Position
 */
export class Position {
    // x轴坐标
    public x: number
    // y轴坐标
    public y: number
    // 构造函数
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
    // 克隆
    clone(): Position {
        return new Position(this.x, this.y)
    }
}
