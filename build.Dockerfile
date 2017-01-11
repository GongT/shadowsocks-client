RUN set -ex && \
	update-resolve && \
	cat /etc/apk/repositories && \
	apk add --virtual TMP    autoconf \
							 build-base \
							 wget \
							 unzip \
							 libtool \
							 linux-headers \
							 openssl-dev \
							 pcre-dev && \
	mkdir -p /tmp/install-ss && \
		cd /tmp/install-ss && \
		wget --no-check-certificate --progress=bar \
			 http://github.com/shadowsocks/shadowsocks-libev/archive/master.zip && \
		unzip master.zip && \
		rm -f master.zip && \
			cd */ && \
			./configure --target=/usr/local --disable-documentation && \
			make -j4 && \
			make install && \
		cd /data && \
	rm -rf /tmp/install-ss && \
	apk del TMP
