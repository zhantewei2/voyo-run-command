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

interface Option{
  label:string;
  envs?:Envs;
  params?:Params;
  command ? :Command;
  inline? :EnvConfig;
  nextParams?:Params; // next command params
}

type EnvConfig =EnvConfigRaw[];

export {
  Command,
  Params,
  Envs,
  EnvConfig,
  Option,
  EnvConfigRaw
}
