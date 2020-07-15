## 使用 GitHub Actions 自动部署 Web APP

### 设置 Secrets
后面部署的 Action 需要有操作你的仓库的权限，因此提前设置好 GitHub personal access（个人访问令牌）。
按照[官方文档](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)，生成一个密钥。授予权限的时候只给 repo 权限即可。
![image](https://user-images.githubusercontent.com/33412781/87534249-5761af80-c6c8-11ea-8bcd-ad07c67dbfd8.png)

然后，将这个密钥储存到当前仓库的Settings/Secrets里面。
![image](https://user-images.githubusercontent.com/33412781/87534013-1073ba00-c6c8-11ea-9fc8-40e4ad808486.png)

### 编写 workflow 文件
创建.github/workflows/ci.yml文件（[查看源码](https://github.com/yangchch6/github-actions-demo/blob/master/.github/workflows/ci.yml))。

```
name: Deploy GitHub Pages

# 触发条件：在 push 到 master 分支后
on:
  push:
    branches:
      - master

# 任务
jobs:
  build-and-deploy:
    # 服务器环境：最新版 Ubuntu
    runs-on: ubuntu-latest
    steps:
    # 拉取代码
    - name: Checkout
      uses: actions/checkout@v2 # If you're using actions/checkout@v2 you must set persist-credentials to false in most cases for the deployment to work correctly.
      with:
        persist-credentials: false
    
    # 生成静态文件
    - name: Install and Build
      run: npm install && npm run build
    
    # 部署到 GitHub Pages
    - name: Deploy
      uses: JamesIves/github-pages-deploy-action@releases/v3
      with:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        BRANCH: gh-pages
        FOLDER: build
```

上面这个 workflow 文件的关键步骤如下。
1.  拉取源码。使用的 action 是actions/checkout。
2. 构建静态资源。直接运行脚本。
3. 部署到 GitHub Pages。使用的 action 是JamesIves/github-pages-deploy-action。此步骤需要四个环境变量，分别为 GitHub 密钥、发布分支、构建成果所在目录、构建脚本。其中，只有 GitHub 密钥是秘密变量，需要写在双括号里面，其他三个都可以直接写在文件里。

> 了解 workflow 的基本语法可以查看[官方帮助](https://docs.github.com/cn/actions/reference/workflow-syntax-for-github-actions)，也可以参考[阮一峰老师的 GitHub Actions 入门教程](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)。

### 触发 Actions
保存上面的文件后，将整个仓库推送到 GitHub。
GitHub 发现了 workflow 文件以后，就会自动运行。可以在仓库的 Actions 页面查看部署情况。
![image](https://user-images.githubusercontent.com/33412781/87534028-149fd780-c6c8-11ea-85a4-68557e885fb3.png)

等到 workflow 运行结束，访问 [GitHub Page](https://yangchch6.github.io/github-actions-demo/)，会看到构建成果已经发上网了。

![image](https://user-images.githubusercontent.com/33412781/87534431-96900080-c6c8-11ea-9940-67b272175571.png)

以后，每次修改后推送源码，GitHub Actions 都会自动运行，将构建产物发布到网页。