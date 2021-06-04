type Command=string | string[];
type Params={
  [key:string]:string|Record<string, any>
};
type Envs={
  [key:string]:any
}
interface EnvConfigRaw<T>{
  title:string;
  select:Array<T>;
}

interface Option{
  label:string;
  envs?:Envs;
  params?:Params;
}

interface OptionFirst extends Option{
  command:Command;
}

interface OptionNext extends Option{
  command?:Command;
}

type EnvConfig =[EnvConfigRaw<OptionFirst>,...EnvConfigRaw<OptionNext>[]];

export {
  Command,
  Params,
  Envs,
  EnvConfig,
  OptionFirst,
  OptionNext,
  Option
}
