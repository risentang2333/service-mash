import {Node} from '../Node'

declare function require(name: string): any
const bg = require('../../assets/node/firewall.png')

export class Firewall extends Node{
    constructor(id, position){
        super(id, position)
        this.name = this.kind = 'Firewall'
        this.image = bg
    }
}