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

build.isInChina(JsonEnv.gfw.isInChina);
build.systemInstallMethod('apk');
build.systemInstall('python', 'py-pip', 'libsodium');

const args = ['--pid-file', '/var/run/ss-client.pid'];

const fast_open = new_kernel();
if (JsonEnv && JsonEnv.gfw) {
	require('fs').writeFileSync(
		require('path').resolve(__dirname, '../config.json'),
		JSON.stringify(Object.assign({fast_open}, JsonEnv.gfw.shadowsocks), null, 8)
	);
	
	args.push('-c');
	args.push('./config.json');
} else if (fast_open) {
	args.push('--fast-open');
}
build.startupCommand.apply(build, args);
build.shellCommand('/usr/bin/sslocal');
// build.stopCommand('stop.sh');

build.forwardPort(7070, 'tcp').publish(7070);
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
