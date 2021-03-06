/// <reference path="./.jsonenv/_current_result.json.d.ts"/>
import {JsonEnv} from "@gongt/jenv-data";
import {EPlugins, MicroBuildConfig} from "./.micro-build/x/microbuild-config";
import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 |  **DON'T EDIT ABOVE THIS LINE**  |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'shadowsocks-client';

build.baseImage('gists/shadowsocks-libev', 'latest');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);

build.isInChina(JsonEnv.gfw.isInChina);
build.forceLocalDns();
build.systemInstallMethod('apk');
// build.systemInstall('pcre', 'openssl');

build.forwardPort(7070);

const fast_open = new_kernel();
try {
	Object.assign(JsonEnv.gfw.shadowsocks, {fast_open});
} catch (e) {
	console.error(JsonEnv.gfw);
	throw e;
}
const config = buildConfigFile(JsonEnv.gfw.shadowsocks);

require('fs').writeFileSync(
	require('path').resolve(__dirname, 'config.json'),
	JSON.stringify(config, null, 8),
);

build.startupCommand('./start.sh');

build.disablePlugin(EPlugins.jenv);

build.noDataCopy();

build.appendDockerFileContent(`
COPY config.json /data/config.json
COPY start.sh /data/start.sh
USER 0
`);
build.volume('/dev/urandom', '/dev/urandom');

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

function buildConfigFile(config) {
	const kcptunConfig = JsonEnv.gfw['kcptun'];
	if (!kcptunConfig) {
		return config;
	}
	
	build.dependService('kcptun-client', 'https://github.com/GongT/kcptun-client.git');
	config.server = 'kcptun-client';
	config.server_port = 6060;
	
	build.forwardPort(config.local_port, 'tcp').publish(config.local_port);
	build.dockerRunArgument('--dns=${HOST_LOOP_IP}');
	
	return config;
}
