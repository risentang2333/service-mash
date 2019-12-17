import {Node} from '../Node'

declare function require(name: string): any
const bg = require('../../assets/node/Server.png')

export class ICG extends Node{
    constructor(id, position){
        super(id, position)
        this.name = this.kind = 'ICG'
        this.image = bg
    }
}