module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  pkg: grunt.file.readJSON('package.json'),
  grunt.initConfig({

    // Concatenate CSS files
    concat: {
      dist: {
        src: [
          // _base.css required for .animated helper class
          'source/_base.css',
          'source/**/*.css'
        ],
        dest: 'animate.css'
      }
    },

    // Auto-prefix CSS properties using Can I Use?
    autoprefixer: {
      options: {
        browsers: ['last 3 versions', 'bb 10', 'android 3']
      },
      no_dest: {
        // File to output
        src: 'animate.css'
      },
    },

    // Minify CSS
    cssmin: {
      minify: {
        src: ['animate.css'],
        dest: 'animate.min.css',
      },
    },

    // Watch files for changes
    watch: {
      css: {
        files: [
          'source/**/*',
          '!node_modules',
          'animate-config.json'
        ],
        // Run Sass, autoprefixer, and CSSO
        tasks: ['concat-anim', 'autoprefixer', 'cssmin'],
      }
    }

  });

  // Register our tasks
  grunt.registerTask('default', ['concat-anim', 'autoprefixer', 'cssmin', 'watch']);

  grunt.registerTask('concat-anim', 'Concatenates activated animations', function () {
    var config = grunt.file.readJSON('animate-config.json'),
        target = [ 'source/_base.css' ],
        count = 0

    for (var cat in config) {
      for (var file in config[cat]) {
        if (config[cat][file]) {
          target.push('source/' + cat + '/' + file + '.css')
          count++
        }
      }
    }

    if (!count) {
      grunt.log.writeln('No animations activated.')
    }

    grunt.log.writeln(count + (count > 1 ? ' animations' : ' animation') + ' activated.')

    grunt.config('concat', { 'animate.css': target })
    grunt.task.run('concat')
  });
};
