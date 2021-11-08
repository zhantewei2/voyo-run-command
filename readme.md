@voyo/run-command
===
An optional executable command

Install
---
```
npm i @voyo/run-command -D
```
for global
```
npm i @voyo/env-command --global
```


Usage
---

```
voyo-run --config voyo-run.json
```
or
```
npx voyo-run --config voyo-run.json
```

RunFile Example
---
#### voyo-run.json
```
[
  {
    "title" : "What do you want",
    "select":[
      {
        "label": "run project",
        "command": "npm run runtime",
        "envs":{
          "NODE_ENV":"development"
        }
      },
      {
        "label": "build project",
        "command":"npm run build",
        "envs":{
          "NODE_ENV":"production"
        }
      }
    ]
  },
  {
    "title": "select platform",
    "select": [
      {
        "label" : "web",
        "params": {
          "platform":"web"
        }
      },
      {
        "label": "mini-program",
        "params": {
          "platform":"mp"
        }
      }
    ]
  }
]
```

config 
---

The config file, which defines how you select and execute commands.
```
config{
    title:string;
    select: Option
}
```
#### Option

- **label** `string`
- **command** `string|Array<string>` executable command
- **params** `record<string,any>` pass parameters to the executable file
- **envs** `record<string,any>`  This value will inject to process.env 
- **inline** `Config[]` Embedded option configuration
- **nextParams** `record<string,any>` pass parameters to the next command
- **renderFile** `{templateFile:string,targetFile}`parse params and render templateFile to targetFile.
#### How to get `params`
Get `params` in executable file as belows
```
const {getVoyoParams} =require("@voyo/run-command");

console.log(getVoyoParams()); // maybe:v {"platform":"web"}
```

