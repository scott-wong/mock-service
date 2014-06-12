# mock-service
===========

一个提供在线存储和生成模拟数据的服务。


## API

1. `/:id`

    * 通过浏览器访问时，返回编辑器页面。
    * 通过 XMLHttpRequest 访问时，返回模拟数据。

2. `/mock/list`
    
    返回所有数据模板。
    
3. `/mock/save?tpl=tpl`
    
    保存数据模板，响应内容的格式为 `{ id: ..., tpl: ..., date: ... }`。
    
4. `/mock/item/:id`

    获取数据模板，响应内容的格式为 `{ id: ..., tpl: ..., date: ... }`。
    
5. `/mock/mock/:id`

    获取模拟数据，通过参数 id 指定数据模板，响应内容的格式为 `{ id: ..., tpl: ..., date: ... }`。

6. `/mock/mock/:tpl`

    传入数据模板，返回模拟数据。

## 启动本地服务

### 1. 启动 Redis

    ./redis-server

### 2. 安装mock-service
* 安装 [nodejs&npm](http://nodejs.org/)
* 安装 mock-service

   ```bash
    npm install mock-service -g
   ```

### 3. 启动 mock-service

   ```bash 
    mock
   ```

### 3. 访问服务 
    
访问 <http://localhost:3000/>。

