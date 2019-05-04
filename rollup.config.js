import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

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
		plugins: [
			resolve(), 
            commonjs(),
            babel()
		],
	}
];