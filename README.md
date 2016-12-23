# shadowsocks-client
```bash
docker pull gongt/shadowsocks-client
docker run -d --name shadowsocks gongt/shadowsocks-client \
		-s x.x.x.x -p 8388 -l 7070 -k password -m aes-256-cfb
```

### config
```
Proxy options:
  -c CONFIG              path to config file
  -s SERVER_ADDR         server address
  -p SERVER_PORT         server port, default: 8388
  -b LOCAL_ADDR          local binding address, default: 127.0.0.1
  -l LOCAL_PORT          local port, default: 1080
  -k PASSWORD            password
  -m METHOD              encryption method, default: aes-256-cfb
  -t TIMEOUT             timeout in seconds, default: 300

General options:
  -v, -vv                verbose mode
  -q, -qq                quiet mode, only show warnings/errors
  --version              show version information
```
