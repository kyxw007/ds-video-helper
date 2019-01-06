# ds-video-helper
群晖Video Station助手，自动获取豆瓣电影信息，并填写Video Station视频信息
## 代码路面
[/] Chrome插件代码负责从页面中获取视频名称，并通过后台爬虫获取豆瓣上的视频信息，填写页面表单
[/ds-helper-server] 豆瓣爬虫代码，其中两个接口
- /videoinfo/list/[videName] 负责通过视频名称去豆瓣搜索电影列表
- /videoinfo/subject/[subjecId] 负责查询一个视频项目的具体信息
## 快速开始
### 启动爬虫后台
- 安装node.js
- 进入目录/ds-helper-server
- 安装工程依赖 npm install
- 启动工程 npm start
### 安装Chrome插件
- 配置video station地址到扩展权限，manifest.json -> permissions
- 打开Chrome扩展
- 加载已解压的扩展程序
### 使用插件
- 打开video station地址，打开无法识别视频，编辑正确名称
- 打开扩展程序
- 点击获取当前视频名称
- 点击从豆瓣获取视频信息
- 点击获取信息并填写表单
- 点击video station中保存视频信息按钮
