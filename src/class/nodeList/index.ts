import {AC} from './AC'
import {AP} from './AP'
import {Firewall} from './Firewall'
import {ICG} from './ICG'
import {Router} from './Router'
import {Switch} from './Switch'
import {Node} from '../Node'
import {Position} from '../Position'

const nodeList: {Fn: {new(id:number, positon: Position): Node}, name:string}[] = [
    {Fn: AC, name: 'AC'},
    {Fn: AP, name: 'AP'},
    {Fn: Firewall, name: 'Firewall'},
    {Fn: ICG, name: 'ICG'},
    {Fn: Router, name: 'Router'},
    {Fn: Switch, name: 'Switch'},
    
]

export default nodeList