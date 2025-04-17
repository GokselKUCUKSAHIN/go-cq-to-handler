const esbuild = require("esbuild");

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const minify = args.includes('--minify');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

/** @type {import('esbuild').BuildOptions} */
const options = {
	entryPoints: ['./src/extension.ts'],
	bundle: true,
	outfile: './dist/extension.js',
	external: ['vscode'],
	format: 'cjs',
	platform: 'node',
	target: 'node16',
	sourcemap: !minify,
	minify: minify,
	plugins: [
		/* add to the end of plugins array */
		esbuildProblemMatcherPlugin,
	],
};

async function main() {
	if (watch) {
		const context = await esbuild.context(options);
		await context.watch();
	} else {
		await esbuild.build(options);
		console.log('[build] build finished');
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
