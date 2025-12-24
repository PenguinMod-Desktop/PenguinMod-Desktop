const processes = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// if (process.versions.node.split('.')[0] != '16') {
// 	console.error('Please use Node v16 for updating penguinmod versions!');
// 	process.exit(0);
// }

const appDir = path.resolve(__dirname, 'app');

const pmDir = path.resolve(__dirname, 'penguinmod');
try {
	fs.accessSync(pmDir);
	fs.rmSync(pmDir, {
		recursive: true,
		force: true,
	});
} catch {
} finally {
	fs.mkdirSync(pmDir);
}

const srcDir = path.resolve(__dirname, 'src');
try {
	fs.accessSync(srcDir);
	fs.rmSync(srcDir, {
		recursive: true,
		force: true,
	});
} catch {
} finally {
	fs.mkdirSync(srcDir);
}

processes
	.spawn(
		'git clone https://github.com/SCsupercraft/PenguinMod-Desktop-Gui.git ./penguinmod', {
			cwd: __dirname,
			stdio: 'inherit',
			shell: true,
	})
	.once('close', (code) => {
		if (code != 0) throw new Error('An unexpected error occurred!');

		fs.rmSync(path.resolve(pmDir, 'package-lock.json'));
		processes
			.spawn('npm i --force', {
				cwd: pmDir,
				stdio: 'inherit',
				shell: true,
			})
			.once('close', (code) => {
				if (code != 0) throw new Error('An unexpected error occurred!');

				process.env.NODE_ENV = 'production';

				processes
					.spawn('npm run build', {
						cwd: pmDir,
						stdio: 'inherit',
						shell: true,
					})
					.once('close', (code) => {
						if (code != 0) throw new Error('An unexpected error occurred!');

						fs.cpSync(path.resolve(pmDir, 'build'), srcDir, {
							recursive: true,
							force: true,
						});
						fs.cpSync(appDir, srcDir, {
							recursive: true,
							force: true,
						});
						fs.rmSync(pmDir, { recursive: true, force: true });
					});
			});
	});
