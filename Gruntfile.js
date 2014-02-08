module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: {
			dev: {
				options: {
					variables: {
						'environment': 'development',
						'destination': './temp/',
						'googleAnalyticsId': '',
					}
				}
			},
			prod: {
				options: {
					variables: {
						'environment': 'production',
						'destination': './dist/',
						'googleAnalyticsId': 'UA-34552232-1'
					}
				}
			}
		},
		replace: {
			dist: {
				options: {
					variables: {
						'googleAnalyticsId': '<%= grunt.config.get("googleAnalyticsId") %>'
					},
					force: true
				},
				files: [
					{expand: true, flatten: true, src: ['www/index.html'], dest: '<%= grunt.config.get("destination") %>'}
				]
			}
		},
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
					'<%= grunt.config.get("destination") %>/amort.min.js': ['src/ko.observableDictionary.js', 'src/ko.moneybinding.js', 'bootstrap-datepicker.js', 'src/*.js']
				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/ko.observableDictionary.js', 'src/ko.moneybinding.js', 'bootstrap-datepicker.js', 'src/*.js'],
				dest: '<%= grunt.config.get("destination") %>/amort.js'
			}
		},
		express: {
			all: {
				options: {
					port: 9001,
					hostname: "127.0.0.0",
					bases: ['<%= grunt.config.get("destination") %>'],
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
				tasks: ['config:dev', 'concat', 'uglify'],
				options: {
					livereload: true
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-config');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-open');
	
	grunt.registerTask('default', ['config:dev', 'replace', 'jshint', 'uglify', 'concat', 'express', 'open', 'watch']);
	grunt.registerTask('build', ['config:prod', 'replace', 'jshint', 'uglify', 'concat']);
};