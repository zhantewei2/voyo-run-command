type Command=string | string[];
type Params={
  [key:string]:string|Record<string, any>
};
type Envs={
  [key:string]:any
}
interface EnvConfigRaw{
  title:string;
  select:Array<Option>;
}

interface RenderFile{
  templateFile: string;
  targetFile:string;
}

interface Option{
  label:string;
  envs?:Envs;
  params?:Params;
  command ? :Command;
  inline? :EnvConfig;
  nextParams?:Params; // next command params
  renderFile: RenderFile;
}

type EnvConfig =EnvConfigRaw[];

export {
  Command,
  Params,
  Envs,
  EnvConfig,
  Option,
  EnvConfigRaw,
  RenderFile
}
