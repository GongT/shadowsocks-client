RUN set -ex && \
	update-resolve && \
	cat /etc/apk/repositories && \
	ping -c 2 mirrors.aliyun.com && \
	apk add libsodium libev udns mbedtls && \
	apk add --virtual TMP    \
							file \
							libsodium-dev \
							udns-dev \
							libev-dev \
							git \
							autoconf \
							automake \
							build-base \
							libtool \
							linux-headers \
							mbedtls-dev \
							pcre-dev && \
	mkdir -p /tmp/install-ss && \
		cd /tmp/install-ss && \
		git clone http://github.com/shadowsocks/shadowsocks-libev && \
		cd shadowsocks-libev/ && \
		git submodule init && git submodule sync &&  git submodule update && \
            libtoolize --force && \
            aclocal --force && \
            autoheader --force && \
            automake --force-missing --add-missing && \
            autoconf --force && \
				./autogen.sh && \
				./configure --target=/usr/local --disable-documentation && \
				make -j2 && \
				make install && \
		cd /data && \
	rm -rf /tmp/install-ss && \
	apk del TMP
