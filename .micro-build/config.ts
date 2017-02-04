import {MicroBuildHelper} from "./x/microbuild-helper";
import {MicroBuildConfig, ELabelNames, EPlugins} from "./x/microbuild-config";
import {JsonEnv} from "../.jsonenv/_current_result";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
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
build.systemInstall('pcre', 'openssl');

const fast_open = new_kernel();
let args = [];
if (JsonEnv && JsonEnv.gfw) {
	const config = buildConfigFile(Object.assign(JsonEnv.gfw.shadowsocks, {fast_open}));
	
	require('fs').writeFileSync(
		require('path').resolve(__dirname, '../config.json'),
		JSON.stringify(config, null, 8)
	);
	args = ['-v', '-c', '/data/config.json'];
} else {
	build.environmentVariable('SERVER_ADDR', '');
	build.environmentVariable('SERVER_PORT', '');
	build.environmentVariable('LISTEN_ADDR', '0.0.0.0');
	build.environmentVariable('LISTEN_PORT', '7070');
	build.environmentVariable('METHOD', 'aes-256-cfb');
	build.environmentVariable('TIMEOUT', '60');
	build.environmentVariable('PASSWORD',
		require('crypto').createHash('md5').update(Math.random().toString(15)).digest('utf-8')
	);
	
	args = [
		'-s', "$SERVER_ADDR",
		'-p', "$SERVER_PORT",
		'-b', "$LISTEN_ADDR",
		'-l', "$LISTEN_PORT",
		'-m', "$METHOD",
		'-k', "$PASSWORD",
		'-t', "$TIMEOUT",
		'-d', "$DNS_ADDR",
		'-u',
		'-A',
		'-v',
	];
	if (fast_open) {
		args.push('--fast-open');
	}
}

build.startupCommand.apply(build, args);
build.shellCommand('/usr/bin/ss-local');
// build.stopCommand('stop.sh');

build.disablePlugin(EPlugins.jenv);

build.prependDockerFile('build.Dockerfile');
build.appendDockerFile('config.Dockerfile');

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
	config.server_port = kcptunConfig.server_port;
	
	build.forwardPort(config.local_port, 'tcp').publish(config.local_port);
	build.dockerRunArgument('--dns=${HOST_LOOP_IP}');
	
	return config;
}
