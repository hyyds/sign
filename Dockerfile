FROM python:3.12-rc-alpine3.16
LABEL AUTHOR="hc" \
      TAG=V1 \
      VERSION=1.0.0

ENV REPO_URL=https://github.com/hyyds/sign.git \
    REPO_BRANCH=main

RUN set -ex \
    && apk update \
    && apk upgrade \
    && apk add --no-cache bash tzdata git moreutils curl jq openssh-client \
    && rm -rf /var/cache/apk/* \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && git clone -b $REPO_BRANCH $REPO_URL /jd_sign \
    && cd /jd_sign\
    && pip3 install flask -i https://mirrors.ustc.edu.cn/pypi/web/simple \
    && cp /jd_sign/docker_entrypoint.sh /usr/local/bin \
    && chmod +x /usr/local/bin/docker_entrypoint.sh

WORKDIR /jd_sign

ENTRYPOINT ["docker_entrypoint.sh"]

#CMD ["pm2-runtime","/jd_bus/ecosystem.config.js"]
