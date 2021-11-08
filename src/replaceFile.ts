const fs=require("fs");

export type ReplaceValue= string| number |boolean |null | undefined;

export const formatVal=(val:ReplaceValue)=>{
  if(val===undefined)return "undefined";
  if(val===null)return "null";
  return val.toString();
}

/**
 * 
 * replace #{name} to name
 * 
 * @param template
 * @param replaceDict
 */
export const replaceTemplate=(template:string,replaceDict:Record<string, any>):string=>{
  for(let i in replaceDict){
    const val=replaceDict[i];
    template=template.replace(new RegExp("#{"+i+"}","g"),formatVal(val));
  }
  return template;
}

export const replaceFile=(
  templateFile:string,
  targetFile:string,
  replaceDict:Record<string,any>
)=>{
  const template=fs.readFileSync(templateFile,"utf-8");
  fs.writeFileSync(targetFile,replaceTemplate(template,replaceDict));
}
