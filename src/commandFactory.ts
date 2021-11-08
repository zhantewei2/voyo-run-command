import {Envs, Option, Params, RenderFile} from "./types";
import {encodeParams, filterVal, genParams, replaceFile} from "./util";
const {exec,spawn}= require("child_process");
const {LoggerFactory} =require("@ztwx/logger");
const log=LoggerFactory.getLogger(__filename);

export type RenderFileLine= { 
  
};
export type CommandLine={
  
};
export type CommonLine={
  renderFileCommand?:RenderFile;
  command?:string;
}

class CommandFactory{
  commandLines:CommandLine[]= [];
  renderFileLines: RenderFileLine[]=[];
  commonLines:CommonLine[]=[];
  
  envs:Envs= {};
  params:Params={};
  nextParams:Params={};
  
  add({command,params,envs,nextParams,renderFile}:Option){
    //params
    if(params)Object.assign(this.params,params);


    //nextParams
    if(nextParams)Object.assign(this.params,nextParams);

    //envs
    if(envs){
      Object.assign(this.envs,envs);
    }
    
    //renderFile
    if(renderFile){
      const renderFileCommand:RenderFileLine={renderFileCommand:renderFile};
      this.renderFileLines.push(renderFileCommand);
      this.commonLines.push(renderFileCommand);
    }
    
    // command
    if(command){
      let commandLines:CommandLine[]=[];
      if(typeof command === "string"){
        commandLines=[{command}];
      }else if(command instanceof Array){
        commandLines=command.map(i=>({command:i}));
      }
      this.commonLines.push(...commandLines);
      this.commandLines.push(...commandLines);
    }
  }
  
  async execute(){
    log.debug("task list: "+JSON.stringify(this.commonLines,null,2));
    log.debug("task params: "+ JSON.stringify(this.params,null,2));
    for(let line of this.commonLines){
      if(line.command){
        const command=line.command
        const arr=command.split(" ");
        await new Promise<any>((resolve,reject)=>{
          const task=spawn(arr[0],arr.slice(1),{
            env:{...process.env,...this.envs,...genParams(this.params)},
            stdio: "inherit",
            shell:true
          })
          task.on("close",()=>resolve(true))
          task.on("error",(e:Error)=>reject(e))
        })
      }else if(line.renderFileCommand){
        const renderFileCommand=line.renderFileCommand;
        replaceFile(renderFileCommand.templateFile,renderFileCommand.targetFile,this.params);
      }
    }
  }
}


export const commandFactory = new CommandFactory();