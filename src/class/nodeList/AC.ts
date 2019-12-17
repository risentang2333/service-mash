import {Node} from '../Node'

declare function require(name: string): any
const bg = require('../../assets/node/AC.png')

export class AC extends Node{
    constructor(id, position){
        super(id, position)
        this.name = this.kind = 'AC'
        this.image = bg
    }
}