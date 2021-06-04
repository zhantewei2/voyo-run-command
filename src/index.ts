#!/usr/bin/env node
import {getArgs, readJson, join} from "./util";
import {EnvConfig, Option} from "./types";
import {commandFactory} from "./commandFactory";
const inquirer=require("inquirer");

const {config:configFileName}=getArgs();

if(!configFileName) throw "Config name must be specified."

const configContent:EnvConfig=readJson(configFileName);


const run=async()=>{
  for(let configRaw of configContent){
    if(configRaw.select)await inquirer.prompt({
      name: "label",
      message: configRaw.title,
      type:"list",
      choices: configRaw.select.map((i:any)=>i.label),
    }).then(({label}:{label:string})=>{
      const option=configRaw.select.find(i=>i.label===label) as Option;
      commandFactory.add(option);
    })
  }
  
  await commandFactory.execute();
}

run();
