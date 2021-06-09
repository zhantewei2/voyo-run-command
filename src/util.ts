import {Params} from "./types";
const paramsKey="voyof-env-params";
const path=require("path");
export const PARAMS_KEY="--";

export const initVal=(value:string):string|number|boolean|undefined|null=>{
  return !isNaN(Number(value))?
      Number(value):
      value==="true"||value==="false"?Boolean(value):
      value==="null"?null:
      value===""?undefined:
      value
}

export const getArgs=(prefix:string="--"):Record<string, any>=>{
  const args=process.argv.slice(2);
  const dict:Record<string, any>={};
  const isKey=(v:string)=>v&&v.startsWith(prefix);
  const cleanKey=(v:string)=>key.replace(new RegExp("^"+prefix),"");
  let key:string,value:any;
  for(let i=0,len=args.length;i<len;i++){
    key=args[i];
    if(isKey(key)){
      value=args[i+1];
      if(!value||isKey(value)){
        dict[cleanKey(key)]=undefined;
      }else{
        dict[cleanKey(key)]=initVal(value);
      }
    }
  }
  return dict;
}
const host=process.cwd();
export const filterVal=(v:string)=>v.trim();

export const join=(...v:string[])=>path.join(host,...v);

export const readJson=(configFile:string)=>require(path.resolve(process.cwd(),configFile))
export const encodeParams=(params:Params):string=>JSON.stringify(params);
export const decodeParams=(str:string|undefined):Params=>{
  try{
    if(!str)return {};
    return JSON.parse(str);
  }catch (e){
    return {}
  }
}
export const genParams=(params?:Params):Record<string, string>=>params?{[paramsKey]:encodeParams(params)}:{};
/**
 * 解析voyo-env-command 传递的参数
 */
export const getVoyoParams=():Params=>{
  return decodeParams(process.env[paramsKey]);
}