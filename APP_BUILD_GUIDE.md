# Smart Campus APP 打包操作文档

本文档详细说明了如何将 Smart Campus 项目打包为 Android 安装包 (APK)。

## 1. 环境准备

在开始打包之前，请确保你的开发环境已安装以下工具：

- **Node.js** (v16 或更高版本)
- **Android Studio** (推荐最新稳定版)
  - 安装时请勾选 "Android SDK" 和 "Android Virtual Device"。
- **Java JDK** (Android Studio 通常自带 JDK 17，无需额外安装)

## 2. 快速打包流程

当你完成了代码修改并想要生成新的 APP 包时，请严格按照以下步骤操作：

### 第一步：构建 Web 资源
首先将 React 代码编译为静态资源（生成到 `dist` 目录）。

```bash
npm run build
```

### 第二步：同步资源到 Android
将构建好的 Web 资源和插件配置同步到 Android 原生项目中。

```bash
npx cap sync
```

### 第三步：打开 Android Studio
使用 Capacitor 提供的命令打开 Android Studio。

```bash
npx cap add android
npx cap open android
```
> **注意**：请务必在项目根目录下运行此命令。

### 第四步：生成 APK
1. 在 Android Studio 中，等待底部的 **Gradle Sync** 进度条跑完（初次可能需要几分钟下载依赖）。
2. 在顶部菜单栏选择 **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**。
3. 构建完成后，右下角会弹出提示 "APK(s) generated successfully"。
4. 点击提示中的 **locate** 链接，即可打开文件夹找到生成的 `.apk` 文件。
   - 默认输出路径：`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 3. 真机调试（可选）

如果你有 Android 手机，开启**开发者模式**和**USB调试**后，连接电脑。
在 Android Studio 顶部工具栏的设备下拉框中选择你的手机，点击绿色的 **Run** 按钮（三角形图标），即可直接安装 APP 到手机。

---

## 4. 常见问题与配置说明

### Gradle 与 Java 版本兼容性
本项目配置已固化为使用 **JDK 17** 和 **Gradle 8.5**，以确保最佳兼容性。

- **Gradle 版本**: 8.5 (在 `android/gradle/wrapper/gradle-wrapper.properties` 中定义)
- **JDK 版本**: 17 (已在 `android/gradle.properties` 中强制指定路径为 `C:/Program Files/Java/jdk-17`)

如果遇到 "Gradle JVM version incompatible" 错误，通常是因为 IDE 默认使用了系统环境变量中的 Java 8。本项目已通过配置文件自动修复此问题，通常只需重新 Sync Gradle 即可。
