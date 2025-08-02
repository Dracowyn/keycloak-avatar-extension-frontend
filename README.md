# Keycloak 头像插件前端

这是一个专为 Keycloak 头像插件设计的前端界面项目，提供了用户头像上传、预览和管理的完整用户体验。

> ⚠️ **注意**: 本项目仅作为参考实现，展示如何在 Keycloakify 中集成头像功能。实际使用时请根据具体需求进行调整。

## 功能特性

- 🖼️ **头像上传**: 支持拖拽和点击选择图片文件
- 👁️ **实时预览**: 上传前可预览头像效果
- 🔄 **自动刷新**: 上传成功后自动更新头像显示
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🌍 **国际化支持**: 多语言界面
- ✨ **PatternFly UI**: 基于 PatternFly 5的现代化界面

## 快速开始

### 前提条件

- Node.js >= 18
- yarn
- docker
- 已安装 [Keycloak 头像插件后端](https://github.com/Dracowyn/keycloak-avatar-extension) 的Keycloak实例

### 安装依赖

```bash
git clone https://github.com/your-username/keycloakify-avatar-extension-frontend
cd keycloakify-avatar-extension-frontend
yarn install
```

### 开发和测试

使用 Keycloakify 提供的开发环境快速启动 Keycloak 进行测试：

```bash
npx keycloakify start-keycloak
```

这个命令会：

- 启动一个包含头像插件的 Keycloak 实例
- 自动应用当前的主题
- 提供热重载功能用于开发

### 构建主题

如果只是构建主题则不需要安装docker和运行Keycloak实例。

```bash
yarn build-keycloak-theme
```

构建完成后，生成的主题文件位于 `dist_keycloak/` 目录中。

## 项目结构

```
src/account/
├── components/
│   ├── UploadAvatarModal.tsx    # 头像上传组件
|   └── UploadAvatarModal.css    # 头像上传组件样式
├── personal-info/
│   └── PersonalInfo.tsx         # 个人信息页面（包含头像显示）
└── ...
```

### 核心组件

#### UploadAvatarModal

头像上传的核心组件，提供：

- 模态对话框形式的上传界面
- 文件拖拽和选择功能
- 图片预览
- 错误处理

#### PersonalInfo

个人信息页面的扩展，在原有字段基础上添加了头像管理功能。

## Keycloak 配置

### 后端插件安装

首先需要安装头像插件后端：

1. 下载或编译 [keycloak-avatar-extension](https://github.com/Dracowyn/keycloak-avatar-extension)
2. 将插件 JAR 文件放入 Keycloak 的 `providers/` 目录
3. 重启 Keycloak

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

本项目采用 MIT 许可证。

## 相关链接

- [Keycloak 头像插件后端](https://github.com/Dracowyn/keycloak-avatar-extension)
- [Keycloakify 官方文档](https://docs.keycloakify.dev/)
- [PatternFly React 组件库](https://www.patternfly.org/)
