import {Params} from "./types";
const paramsKey="voyof-env-params";
const path=require("path");
export const initVal=(value:string):string|number|boolean|undefined|null=>{
  return !isNaN(Number(value))?
      Number(value):
      value==="true"||value==="false"?Boolean(value):
      value==="null"?null:
      value===""?undefined:
      value
}

export const getArgs=():Record<string, any>=>{
  const args=process.argv.slice(2);
  const dict:Record<string, any>={};
  let key:string,value:any;
  for(let i =0,len=args.length;i<len;i+=2){
    key=args[i];
    value=args[i+1];
    if(key)key=key.replace(/^--/,"");
    dict[key]=initVal(value);
  }
  return dict;
}
const host=process.cwd();
export const filterVal=(v:string)=>v.trim();

export const join=(...v:string[])=>path.join(host,...v);

export const readJson=(configFile:string)=>require(path.resolve(process.cwd(),configFile))
export const encodeParams=(params:Params):string=>JSON.stringify(params);
export const decodeParams=(str:string):Params=>{
  try{
    return JSON.parse(str);
  }catch (e){
    return {}
  }
}
export const genParams=(params:Params):string=>`--${paramsKey} ${encodeParams(params)}`
/**
 * 解析voyo-env-command 传递的参数
 */
export const getVoyoParams=():Params=>{
  const args=getArgs();
  return !args[paramsKey]?{}:decodeParams(args[paramsKey])
}