module.exports = function(grunt) {

	grunt.initConfig({
		watch:{
			jade: {
				files: ['app/views/**', 'app/views/**/*.jade'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'app/models/*.js', 'app/schemas/*.js'],
				options: {
					livereload: true
				}
			},
		},
		nodemon: {
			dev: {
				options:{
					file: 'app.js',
					args: [],
					ignoredFiles: ["README.md", "node_modules/**", ".DS_Store"],
					watchedFolders: ['./'],
					debug: true,
					env: {
						PORT:3000
					},
					cwd: __dirname
				}
			}
		},
		jshint: {
			all: ['gruntfile.js', 'public/lib/**/*.js', 'app/**/*.js']
		},
		mochaTest: {
			options : {
				reporter: "spec"
			},
			src:['test/**/*.js']
		},

		concurrent: {
			tasks:['watch', 'nodemon', "jshint"],
			options: {
				logConcurrentOutput: true
			}
		}
	})
	grunt.loadNpmTasks("grunt-contrib-watch")
	grunt.loadNpmTasks("grunt-contrib-jshint")
	grunt.loadNpmTasks("grunt-nodemon")
	grunt.loadNpmTasks("grunt-concurrent")
	grunt.loadNpmTasks("grunt-mocha-test")
	grunt.option('force', true);

	grunt.registerTask("default", ['concurrent']);
	grunt.registerTask("test", ['mochaTest']);
}