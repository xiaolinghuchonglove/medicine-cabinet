@echo off
REM 智能药箱管家 - APK构建脚本
REM 需要先安装:
REM 1. JDK 21: https://adoptium.net/
REM 2. Android SDK: https://developer.android.com/studio

echo 设置环境变量...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot
set ANDROID_HOME=C:\Android\sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%

echo 构建APK...
cd android
call gradlew.bat assembleDebug

echo 构建完成！APK位于: android\app\build\outputs\apk\debug\app-debug.apk
pause
