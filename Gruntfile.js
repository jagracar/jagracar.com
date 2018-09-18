module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		// grunt-contrib-sass
		sass : {
			options : {
				sourcemap : 'none',
				style : 'expanded'
			},
			build : {
				src : 'sass/styles.scss',
				dest : 'WebContent/css/styles.css'
			}
		},

		// grunt-autoprefixer
		autoprefixer : {
			build : {
				src : 'WebContent/css/styles.css',
				dest : 'WebContent/css/styles.css'
			}
		},

		// grunt-jshint
		jshint : {
			build : [ 'Gruntfile.js', 'package.json', 'WebContent/js/*.js' ]
		},

		// grunt-contrib-watch
		watch : {
			build : {
				files : [ 'sass/partials/*.scss', 'WebContent/js/*.js' ],
				tasks : [ 'default' ]
			}
		}
	});

	// Load the grunt tasks
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task
	grunt.registerTask('default', [ 'sass', 'autoprefixer', 'jshint' ]);
};
