function forwardConsole(fnName, otherFnName) {
	const original = console[fnName];
	console[fnName] = (...message) => {
		original(...message);
		window.__TAURI__.log[otherFnName](
			message.reduce((t, c) => t + ' ' + c.toString(), '')
		);
	};
}

forwardConsole('log', 'info');
forwardConsole('info', 'info');
forwardConsole('trace', 'trace');
forwardConsole('debug', 'debug');
forwardConsole('warn', 'warn');
forwardConsole('error', 'error');

console.log('initializing...');

const status = document.querySelector('#status');

let update = null;
status.innerHTML = 'Checking for updates...';
try {
	update = await __TAURI__.updater.check();
} catch (error) {
	console.warn('failed to check for updates');
}
if (update) {
	console.log(
		`found update ${update.version} from ${update.date} with notes ${update.body}`
	);
	let downloaded = 0;
	let contentLength = 0;
	await update.downloadAndInstall((event) => {
		switch (event.event) {
			case 'Started':
				contentLength = event.data.contentLength;
				console.log(
					`started downloading ${event.data.contentLength} bytes`
				);
				status.innerHTML = `Downloading update... (${Math.floor(
					100 * (downloaded / contentLength)
				)}%)`;
				break;
			case 'Progress':
				downloaded += event.data.chunkLength;
				console.log(`downloaded ${downloaded} from ${contentLength}`);
				status.innerHTML = `Downloading update... (${Math.floor(
					100 * (downloaded / contentLength)
				)}%)`;
				break;
			case 'Finished':
				console.log('download finished');
				status.innerHTML = 'Installing update...';
				break;
		}
	});

	console.log('update installed');
	status.innerHTML = 'Restarting...';
	await __TAURI__.process.relaunch();
} else {
	console.log('initialized');
	status.innerHTML = 'Loading';
	__TAURI__.core.invoke('set_complete', { task: 'frontend_init' });

	__TAURI__.deepLink.getCurrent().then((urls) => {
		if (!urls) __TAURI__.core.invoke('create_main_window');
		else __TAURI__.core.invoke('create_main_window', { deepLink: urls[0] });
	});
}
