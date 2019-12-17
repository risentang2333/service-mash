import {Node} from '../Node'

declare function require(name: string): any
const bg = require('../../assets/node/AP.png')

export class AP extends Node{
    constructor(id, position){
        super(id, position)
        this.name = this.kind = 'AP'
        this.image = bg
    }
}