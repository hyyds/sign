#!/bin/sh
/sbin/iptables -I INPUT -p tcp --dport 8840 -j ACCEPT
echo
echo "第一步：下载docker脚本"
echo

curl https://get.docker.com/ > install-docker.sh

echo
echo "已下载docker安装脚本"
echo

echo
echo "第二步：docker安装"
echo

sh install-docker.sh

echo
echo "docker安装完成"

echo
echo "第三步：设置docker开机自启动"
echo

systemctl enable docker
systemctl start docker

echo
echo "docker开机自启动设置完成"
echo

echo
echo "第四步：安装docker-compose"
echo

curl -L https://get.daocloud.io/docker/compose/releases/download/1.32.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

echo
echo "docker-compose安装完成"
echo

echo
echo "第五步：构建本地镜像文件"
echo

docker image build ./ -t jd_sign:latest

echo
echo "本地镜像文件构建成功"
echo

echo
echo "第六步：使用docker-compose启动容器"
echo

docker-compose up -d

echo
echo "容器启动成功"
echo


echo
echo "第七步：输出容器日志"
echo

docker logs -f jd_sign

echo
echo "容器日志输出成功"
echo


echo
echo "第八步：退出程序"
echo

exit


