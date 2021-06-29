import {Envs, Option, Params} from "./types";
import {encodeParams, filterVal, genParams, PARAMS_KEY} from "./util";
const {exec,spawn}= require("child_process");
const {LoggerFactory} =require("@ztwx/logger");
const log=LoggerFactory.getLogger(__filename);
export interface CommandLine{
  command:string;
  params?:Params;
}

class CommandFactory{
  commandLines:CommandLine[]= [];
  envs:Envs= {};
  params:Params={};
  nextParams:Params={};
  
  add({command,params,envs,nextParams}:Option){
    // command
    if(command){
      this.checkParams();
      if(typeof command === "string"){
        this.commandLines.push({command});
      }else if(command instanceof Array){
        this.commandLines.push(...command.map(i=>({command:i})));
      }
    }
    
    //params
    if(params)Object.assign(this.params,params);
    
    //nextParams
    if(nextParams)Object.assign(this.nextParams,nextParams);
    
    //envs
    if(envs){
      Object.assign(this.envs,envs);
    }
  }
 
  checkParams(){
    const lastedIndex=this.commandLines.length-1;
    if(lastedIndex>=0&&Object.keys(this.params).length && this.commandLines[lastedIndex]){
      this.commandLines[lastedIndex].params=this.params;
      this.params={};
    }
    Object.assign(this.params,this.nextParams);
    this.nextParams={};
  }
  async execute(){
    this.checkParams();
    log.debug("task list: "+JSON.stringify(this.commandLines,null,2));
    
    for(let {command,params} of this.commandLines){
      const arr=command.split(" ");
      await new Promise<any>((resolve,reject)=>{
        const task=spawn(arr[0],arr.slice(1),{
          env:{...process.env,...this.envs,...genParams(params)},
          stdio: "inherit",
          shell:true
        })
        task.on("close",()=>resolve(true))
        task.on("error",(e:Error)=>reject(e))
      })
    }
    
  }
}


export const commandFactory = new CommandFactory();