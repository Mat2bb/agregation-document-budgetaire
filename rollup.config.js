import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'scripts/entry/main.js',
		output: {
			file: 'build/rollup-bundle-main.js',
			format: 'esm'
		},
		plugins: [
			resolve(), 
            commonjs(),
            babel()
		]
	},
	{
		input: 'scripts/entry/formula-examples.js',
		external: [ 'https://cdn.jsdelivr.net/gh/DavidBruant/bouture@13cb6c683fa87e5feea574311dcda6353489bb3b/bouture.js' ],
		output: {
			file: 'build/rollup-bundle-formula-examples.js',
			format: 'esm'
		},
		// adapted from https://github.com/sveltejs/template/blob/10adbb48bfda8287a4e9ab1c877f9ba47bdc156e/rollup.config.js
		plugins: [ 
			svelte({
				// enable run-time checks when not in production
				dev: !production,
				// we'll extract any component CSS out into
				// a separate file — better for performance
				css: css => {
					css.write('build/bundle.css');
				}
			}),
	
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration —
			// consult the documentation for details:
			// https://github.com/rollup/rollup-plugin-commonjs
			resolve({ browser: true }),
			commonjs(),
			!production && livereload(),
	
			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),
			babel()
		],
		watch: {
			clearScreen: false
		}
	}
];