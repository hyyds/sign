#!/bin/sh
set -e

#获取配置的自定义参数
if [ -n "$1" ]; then
  run_cmd=$1
fi

(
if [ -f "/jd_sign/pull.lock" ]; then
  echo "存在更新锁定文件，跳过git pull操作..."
else
  echo "设定远程仓库地址..."
  cd /jd_sign
  git remote set-url origin "$REPO_URL"
  git reset --hard
  echo "git pull拉取最新代码..."
  git -C /jd_sign pull --rebase
fi
) || exit 0


echo "--------------------------------------------------开启python service---------------------------------------------------"

echo "启动python service服务..."

python3 /jd_sign/signapi.py

echo "python service服务任务执行结束。"
