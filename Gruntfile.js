module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      files: [
        'lib'
      ]
    },

    eslint: {
      files: 'src/**/*.js'
    },

    mochaTest: {
      test: {
        src: 'tests/*.js',
        options: {
          reporter: 'spec',
          require: 'tests/support/node'
        }
      }
    },

    babel: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'lib'
        }]
      },
      options: {
        presets: [
          '@babel/preset-env'
        ],
        plugins: [
          '@babel/proposal-decorators',
          '@babel/proposal-class-properties'
        ]
      }
    }
  });

  grunt.registerTask('default', ['clean', 'babel']);
  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['mochaTest']);
};
