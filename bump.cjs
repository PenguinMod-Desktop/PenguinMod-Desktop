const fs = require('node:fs/promises');
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

readline.question(
	'Enter a number from 1-3\n\t1: MAJOR\n\t2: MINOR\n\t3: PATCH\n',
	async (type) => {
		const pkgJson = JSON.parse(await fs.readFile('package.json'));
		const pkgLock = JSON.parse(await fs.readFile('package-lock.json'));
		const tauriConfig = JSON.parse(
			await fs.readFile('src-tauri/tauri.conf.json')
		);
		const currentVer = pkgJson.version;
		let newVerParts = currentVer.split('.');
		switch (type) {
			case '1': {
				newVerParts[0] = Number(newVerParts[0]) + 1;
				newVerParts[1] = 0;
				newVerParts[2] = 0;
				break;
			}
			case '2': {
				newVerParts[1] = Number(newVerParts[1]) + 1;
				newVerParts[2] = 0;
				break;
			}
			case '3': {
				newVerParts[2] = Number(newVerParts[2]) + 1;
				break;
			}
			default: {
				throw new Error('Invalid input!');
			}
		}
		const newVer = newVerParts.reduce(
			(result, part, i) => `${result}${i > 0 ? '.' : ''}${part}`,
			''
		);

		pkgJson.version = newVer;
		pkgLock.version = newVer;
		pkgLock.packages[''].version = newVer;
		tauriConfig.version = newVer;
		tauriConfig.app.windows[0].title = `PenguinMod Desktop - Version ${newVer}`;

		await fs.writeFile('package.json', JSON.stringify(pkgJson, null, 4));
		await fs.writeFile(
			'package-lock.json',
			JSON.stringify(pkgLock, null, 4)
		);
		await fs.writeFile(
			'src-tauri/tauri.conf.json',
			JSON.stringify(tauriConfig, null, 4)
		);

		console.log(`${currentVer} --> ${newVer}`);
		readline.close();
	}
);
