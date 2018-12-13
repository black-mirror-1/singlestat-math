module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-tslint');
  grunt.loadNpmTasks('grunt-ts');

  grunt.initConfig({

    clean: ["dist"],

    copy: {
      lib_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['lib/**'],
        dest: 'dist'
      },
      html_to_dist: {
        expand: true,
        flatten: true,
        cwd: 'src',
        src: ['*.html'],
        dest: 'dist'
      },
      css_to_dist: {
        expand: true,
        flatten: true,
        cwd: 'src/css',
        src: ['*.css', '*.scss'],
        dest: 'dist/css/',
      },
      img_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['img/*'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        flatten: true,
        src: [ 'src/plugin.json', 'README.md' ],
        dest: 'dist/',
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'plugin.json'],
        tasks: ['default'],
        options: {spawn: false}
      },
    },

    tslint: {
      options: {
        // Task-specific options go here.
        configuration: "tslint.json"
      },
      files: {
          // Target-specific file lists and/or options go here.
          src: ['src/**/*.ts'],
      },
    },

    ts: {
      build: {
        src: ['src/**/*.ts', '!**/*.d.ts', '!**/*.min.js'],
        outDir: 'dist',
        options: {
          rootDir: 'src',
          verbose: true,
          target: 'ES5',
          inlineSourceMap: true,
          inlineSources: true,
          module: 'system',
          sourceMap: true,
          declaration: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          noImplicitAny: false,
          strictNullChecks: false,
          skipLibCheck: true,
        },
      },
    },

  });
  // tslint as first task
  //grunt.registerTask('default', ['tslint', 'clean', 'copy:lib_to_dist', 'copy:html_to_dist', 'copy:css_to_dist', 'copy:img_to_dist', 'copy:pluginDef', 'ts:build']);
  grunt.registerTask('default', ['clean', 'copy:lib_to_dist', 'copy:html_to_dist', 'copy:css_to_dist', 'copy:img_to_dist', 'copy:pluginDef', 'ts:build']);
};
