import axios, {AxiosPromise} from 'axios'
import { File } from '../class/File';

axios.interceptors.response.use(function (config):any {
    if(config.data.state == 0){
        return config.data.data
    } else {
        throw new Error("数据加载失败" + JSON.stringify(config))
    }
});
export default {
    saveFile(file){
        // return axios.get(`/cacti/topology.php?method=update&data=${file}`)
        return axios.get('')
    },
    getFile(): Promise<any>{
        if(window['config'].mock){
            return Promise.resolve(`{"width":1200,"height":1000,"nodeList":[{"id":1513696342120,"ip":"127.0.0.1","kind":"AC","name":"AC","position":{"x":576,"y":282}},{"id":1513696343478,"ip":"127.0.0.1","kind":"AC","name":"AC","position":{"x":508,"y":425}},{"id":1513696345390,"ip":"127.0.0.1","kind":"AC","name":"AC","position":{"x":685,"y":408}},{"id":1513696348805,"ip":"127.0.0.1","kind":"Firewall","name":"Firewall","position":{"x":364,"y":347}},{"id":1513696386258,"ip":"127.0.0.1","kind":"AC","name":"AC","position":{"x":410,"y":190}}],"lineList":[{"id":1513696407720,"startNodeId":1513696386258,"endNodeId":1513696348805,"centerPoints":[]},{"id":1513696409417,"startNodeId":1513696386258,"endNodeId":1513696342120,"centerPoints":[]},{"id":1513696411397,"startNodeId":1513696342120,"endNodeId":1513696343478,"centerPoints":[]},{"id":1513696412946,"startNodeId":1513696342120,"endNodeId":1513696345390,"centerPoints":[]}]}`)
        } else {
            return axios.get(`/cacti/topology.php?method=get`)
        }
    },
    checkIps(ips: string[]): Promise<{[ip:string]: boolean}>{
        return axios.get(`/cacti/topology.php?method=warning${ips.map(ip=>`&ips[]=${ip}`).join('')}`)
            .then(data=>(data as any) as {[ip:string]: boolean})
    }
}