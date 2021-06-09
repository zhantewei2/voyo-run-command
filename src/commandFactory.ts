import {Envs, OptionFirst, OptionNext, Params} from "./types";
import {encodeParams, filterVal, genParams, PARAMS_KEY} from "./util";
const {exec,spawn}= require("child_process");
const {LoggerFactory} =require("@ztwx/logger");
const log=LoggerFactory.getLogger(__filename);

class CommandFactory{
  commandLines:string[]= [];
  envs:Envs= {};
  params:Params={};

  
  add({command,params,envs}:OptionFirst|OptionNext){
    // command
    if(command){
      this.checkParams();
      if(typeof command === "string"){
        this.commandLines.push(command);
      }else if(command instanceof Array){
        this.commandLines.push(...command);
      }
    }
    
    //params
    if(params)Object.assign(this.params,params);
    
    //envs
    if(envs){
      Object.assign(this.envs,envs);
    }
  }
 
  checkParams(){
    const lastedIndex=this.commandLines.length-1;
    if(lastedIndex>=0&&Object.keys(this.params).length && this.commandLines[lastedIndex]){
      this.commandLines[lastedIndex]+=" "+genParams(this.params,PARAMS_KEY);
      this.params={};
    }
  }
  async execute(){
    this.checkParams();
    log.debug("task list: "+JSON.stringify(this.commandLines,null,2));
    
    for(let command of this.commandLines){
      const arr=command.split(" ");
      await new Promise<any>((resolve,reject)=>{
        const task=spawn(arr[0],arr.slice(1),{
          env:{...process.env,...this.envs},
          stdio:"inherit"
        })
        task.on("close",()=>resolve(true))
        task.on("error",(e:Error)=>reject(e))
      })
    }
    
  }
}


export const commandFactory = new CommandFactory();