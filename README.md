# 珠江智联-基础框架

### vite 配置

[Vite Configuration Reference](https://vitejs.dev/config/).

### 依赖安装

> npm run install

### 本地启动

> npm run dev

### 打包

> 不走ts校验
>
>  npm run build

> 走ts校验
>
>  npm run build:ts

### 编码格式检查 [ESLint](https://eslint.org/)

> npm run lint:fix

### 相应版本信息

> vite：2.2.4
>
> vue： 3.2.x
>
> node：16.20.0
>
> npm：8.19.4

### 兼容性注意 ！！！

- Vite 需要 Node.js 版本 14.18+，16+。
- 然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。

### 约定规范

#### Git 贡献提交规范

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `ci` 持续集成

#### 常量定义

- 大写 + 下划线 例如：XXXX_XXXX

## [公用css](./src/assets/style)

- [antd.less](./src/assets/style/antd.less) antdv覆盖样式写
- [init.less](./src/assets/style/init.less) 全局样式写
- [main.less](./src/assets/style/main.less) 全局通用样式
- [variables.less](./src/assets/style/variables.less) css常量存放

## [公用组件](./src/components)

##### 详细用法参考文件内文档说明

- [BasicTable](./src/components/BasicTable) 表格组件
- [QueryFilter](./src/components/QueryFilter) 搜索组件
- [svg-icon](./src/components/svg-icon) 图标组件
