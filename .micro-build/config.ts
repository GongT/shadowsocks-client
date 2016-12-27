import {MicroBuildConfig, EPlugins} from "./x/microbuild-config";
declare const build: MicroBuildConfig;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'shadowsocks-client';

build.baseImage('alpine', 'latest');
build.projectName(projectName);
build.domainName(projectName + '.gongt');

build.noDataCopy();
build.systemInstallMethod('apk');
build.systemInstall('python', 'py-pip', 'libsodium', 'privoxy');

const fast_open = new_kernel();
if (JsonEnv && JsonEnv.gfw) {
	build.isInChina(JsonEnv.gfw.isInChina);
	
	require('fs').writeFileSync(
		require('path').resolve(__dirname, '../config.json'),
		JSON.stringify(Object.assign({fast_open}, JsonEnv.gfw.shadowsocks), null, 8)
	);
	build.startupCommand('/usr/sbin/privoxy /etc/privoxy/config ; /usr/bin/sslocal --pid-file /var/run/ss-client.pid -c /data/config.json');
} else {
	build.startupCommand(`/usr/sbin/privoxy /etc/privoxy/config ; /usr/bin/sslocal --pid-file /var/run/ss-client.pid ${fast_open? '--fast-open' : ''}`);
}
build.shellCommand('/bin/sh', '-c');
// build.stopCommand('stop.sh');

build.forwardPort(8118, 'tcp').publish(7070);
build.forwardPort(7070, 'udp').publish(7070);

build.disablePlugin(EPlugins.jenv);

build.prependDockerFile('build.Dockerfile');
// build.appendDockerFile('/path/to/docker/file');

function new_kernel() {
	const os = require('os');
	if (os.platform() !== 'linux') {
		return false;
	}
	const ver = /^(\d+)\.(\d+)/.exec(os.release());
	if (!ver) {
		return false;
	}
	if (ver[1] > 3) {
		return true;
	}
	if (ver[1] < 3) {
		return false;
	}
	return ver[2] >= 16;
}
