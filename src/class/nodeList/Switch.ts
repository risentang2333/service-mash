import {Node} from '../Node'

declare function require(name: string): any
const bg = require('../../assets/node/Switch.png')

export class Switch extends Node{
    constructor(id, position){
        super(id, position)
        this.name = this.kind = 'Switch'
        this.image = bg
    }
}