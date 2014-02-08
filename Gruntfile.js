module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['**.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					console: true,
					module: true,
					document: true
				}
			}
		},
		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					'www/index.min.js': ['src/ko.observableDictionary.js', 'src/ko.moneybinding.js', 'bootstrap-datepicker.js', 'src/*.js']
				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/ko.observableDictionary.js', 'src/ko.moneybinding.js', 'bootstrap-datepicker.js', 'src/*.js'],
				dest: 'www/index.js'
			}
		},
		express: {
			all: {
				options: {
					port: 9001,
					hostname: "127.0.0.0",
					bases: ['www'],
					livereload: true
				}
			}
		},
		open: {
			all: {
				path: 'http://localhost:<%= express.all.options.port%>'
			}
		},
		watch: {
			scripts: {
				files: ['src/*.js', 'www/*.html'],
				tasks: ['concat', 'uglify'],
				options: {
					livereload: true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'express', 'open', 'watch']);
};