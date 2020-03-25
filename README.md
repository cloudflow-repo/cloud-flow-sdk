# Cloud Flow 云函数客户端SDK


## 环境需求

- Node.JS >= 10.0



## 安装

```bash
yarn add @cloud-flow/sdk
```

或者

```
npm install -S @cloud-flow/sdk
```


## 基本用法

### 初始化客户端

```js
const { CloudFlowService } = require('@cloud-flow/sdk');

const client = new CloudFlowService({
  apiKey: '<YOUR_API_KEY>',
  // 工程 api key, 在 Cloud Flow 工程面板可以查看

  host: 'https://mrsongshu.com/cloud-flow/'
  // Cloud-Flow 云服务提供商网址
});
```



### 执行云函数

假设工程中有一个名为 `test` 的云函数：
```js
module.exports = function test(options) {
  return options.message.toUpperCase();
}
```

在客户端可以按照如下方式执行：


```js
await client.invoke('test', {
  message: 'hello world'
});

/**
 * 输出
 * HELLO WORLD
 * /
```

云函数默认的 HTTP 请求方法为 `GET`，要自定义请求方法，也可以在请求时给出更详细的配置：
```js
await client.invoke('test', {
  message: 'hello world'
}, {
  method: 'POST',
  headers: {
    // custom headers here
  }
});
```



## 进阶用法

### 快照简介

对于非GET请求云函数，每次都要手动给定 HTTP 选项显然很繁琐，可以通过为云函数创建快照来简化步骤：

```js
client.createSnapshot('test', {
  httpOptions: {
    method: 'POST'
  }
});
```


调用时只需调用快照即可
```js
await client.snapshots.test({
  message: 'hello world'
});
```


### 其他快照用例

下面是快照的一些其他用法

#### 自定义快照逻辑
```js
client.createSnapshot('test', async function() {
  const output = await client.invoke('test', {
    message: 'hello world'
  });
  return output.split('').reverse().join('');
});
/**
 * 输出
 * DLROW OLLEH
 * /
```



### 手动指定云函数名（自定义快照名称）

```js
client.createSnapshot('myTest', {
  functionName: 'test'
});
await client.snapshots.myTest({
  message: 'hello world'
});
/**
 * 输出
 * HELLO WORLD
 * /
```


### 提供默认参数

```js
client.createSnapshot('test', {
  defaultParams: {
    message: 'hello world'
  }
});

await client.snapshots.test();
/**
 * 输出
 * HELLO WORLD
 * /
```
