import {Node} from '../Node'

declare function require(name: string): any
const bg = require('../../assets/node/Router.png')

export class Router extends Node{
    constructor(id, position){
        super(id, position)
        this.name = this.kind = 'Router'
        this.image = bg
    }
}