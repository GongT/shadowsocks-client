ENV SS_VER 2.6.3
ENV SS_URL https://github.com/shadowsocks/shadowsocks-libev/archive/v$SS_VER.tar.gz
ENV SS_DIR shadowsocks-libev-$SS_VER

RUN set -ex && \
	update-resolve && \
	cat /etc/apk/repositories && \
	ping -c 2 mirrors.aliyun.com && \
	apk add libcrypto1.0 \
			libev \
			libsodium \
			pcre \
			udns && \
	apk add --virtual TMP
			autoconf \
			automake \
			build-base \
			curl \
			gettext-dev \
			libev-dev \
			libsodium-dev \
			libtool \
			linux-headers \
			openssl-dev \
			pcre-dev \
			tar \
			udns-dev && \
	mkdir -p /tmp/install-ss && \
		cd /tmp/install-ss && \
		curl -sSL $SS_URL | tar xz && \
		cd $SS_DIR && \
		curl -sSL https://github.com/shadowsocks/ipset/archive/shadowsocks.tar.gz | \
					tar xz --strip 1 -C libipset && \
		curl -sSL https://github.com/shadowsocks/libcork/archive/shadowsocks.tar.gz | \
					tar xz --strip 1 -C libcork && \
			./autogen.sh && \
			./configure --target=/usr/local --disable-documentation && \
			make -j2 && \
			make install && \
		cd /data && \
	rm -rf /tmp/install-ss && \
	apk del TMP
