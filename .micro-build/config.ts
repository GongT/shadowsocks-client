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
build.systemInstall('python', 'py-pip', 'libsodium');

if (JsonEnv && JsonEnv.gfw) {
	build.isInChina(JsonEnv.gfw.isInChina);
	require('fs').writeFileSync(
		require('path').resolve(__dirname, '../config.json'),
		JSON.stringify(JsonEnv.gfw.proxy, null, 8)
	);
	build.startupCommand('/usr/bin/sslocal', '--pid-file', '/var/run/ss-client.pid', '--fast-open', '-c', '/data/config.json');
} else {
	build.startupCommand('/usr/bin/sslocal', '--pid-file', '/var/run/ss-client.pid', '-q', '--fast-open');
}
build.shellCommand('/usr/bin/python');
// build.stopCommand('stop.sh');

build.forwardPort(7070, 'tcp').publish(7070);
build.forwardPort(7070, 'udp').publish(7070);

build.disablePlugin(EPlugins.jenv);

build.prependDockerFile('build.Dockerfile');
// build.appendDockerFile('/path/to/docker/file');
