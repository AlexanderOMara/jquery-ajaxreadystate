/* global module */
module.exports = function(grunt) {
	//Load tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jsonlint');
	
	//Create config.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: [
			'dist/**/*.js'
		],
		jshint: {
			options: {
				jshintrc: true
			},
			src: [
				'Gruntfile.js',
				'src/**/*.js',
				'test/**/*.js'
			]
		},
		jsonlint: {
			pkg: {
				src: [
					'package.json'
				]
			},
			bower: {
				src: [
					'bower.json'
				]
			}
		},
		uglify: {
			dist: {
				options: {
					preserveComments: 'some'
				},
				files: {
					'dist/jquery-ajaxreadystate.min.js': ['src/jquery-ajaxreadystate.js']
				}
			}
		}
	});
	
	//Development task.
	grunt.registerTask('dev', ['clean', 'jshint', 'jsonlint']);
	
	//Release task.
	grunt.registerTask('default', ['clean', 'jshint', 'jsonlint', 'uglify']);
};