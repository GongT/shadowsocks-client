RUN pip install shadowsocks
COPY config.json /data/config.json
RUN grep -v 'listen-address' /etc/privoxy/config > /tmp/xxx && \
	echo "listen-address 0.0.0.0:8118" >> /tmp/xxx && \
	echo "forward-socks5   /  127.0.0.1:7070 ." >> /tmp/xxx && \
	cat /tmp/xxx > /etc/privoxy/config
