#!/usr/bin/env node
import {getArgs, readJson, join} from "./util";
import {EnvConfig, EnvConfigRaw, Option} from "./types";
import {commandFactory} from "./commandFactory";
const inquirer=require("inquirer");

type typeOpts={
  config:string; //config name;
  labels: string|string[]; //a command line executes all options; string split ',';
}

let {config:configFileName,labels}=getArgs() as typeOpts;

if(labels) labels=(labels as string).split(",")

if(!configFileName) throw "Config name must be specified."

const configContent:EnvConfig=readJson(configFileName);


const runRaw=(raw:EnvConfigRaw):Promise<any>=>{
  return raw.select? inquirer.prompt({
    name: "label",
    message: raw.title,
    type:"list",
    choices: raw.select.map((i:any)=>i.label),
  }).then(({label}:{label:string})=>{
    const option=raw.select.find(i=>i.label===label) as Option;
    commandFactory.add(option);
    if(option.inline)return run(option.inline);
  }):Promise.resolve();
}

const run=async(configs: EnvConfig,execute?:boolean)=>{
  for(let configRaw of configs){
    await runRaw(configRaw);
  }
  if(execute)await commandFactory.execute();
}

const runLabels=async(configs: EnvConfig,labelIndex:number,execute?:boolean)=>{
  for(let configRaw of configs){
    const label=labels[labelIndex++];
    const option= configRaw.select.find(option=>option.label===label) as Option;
    if(!option) break;
    commandFactory.add(option);
    if(option.inline) await runLabels(option.inline,labelIndex);
  }

  if(execute) await commandFactory.execute();
}

if(!labels) {
  run(configContent, true);
}else{
  runLabels(configContent, 0,true);
}
