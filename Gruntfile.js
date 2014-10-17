module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['public/client/fraction.js','public/client/models/NumberModel.js', 'public/client/models/OperationModel.js',
        'public/client/models/ComputeModel.js', 'public/client/models/AppModel.js', 'public/client/collections/Numbers.js',
        'public/client/collections/NumberQueue.js', 'public/client/collections/ComputeQueue.js','public/client/views/NumberView.js',
        'public/client/views/OperationView.js', 'public/client/views/NumberQueueView.js', 'public/client/views/ComputeView.js',
        'public/client/views/AppView.js', 'public/client/main.js'],
        dest: 'public/dist/built.js',
      },
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'public/dist/output.min.js': ['public/dist/built.js']
        }
      }
    },

    jshint: {
      files: {
        src: ['app/**/*.js']
        // Add filespec list here
      },
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      my_target: {
        files: [{
          expand: true,
          cwd: 'public/lib',
          src: ['*.css', '!*.min.css'],
          dest: 'public/dist/',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },
    shell: {
      scaleSite: {
        command: "azure site scale mode standard challenge24"
      },
      gitAdd: {
        command: "git add ."
      },
      gitCommit: {
        command: "git commit"
      },
      gitPush: {
        command: "git push azure2 master"
      },
      downScaleSite: {
        command:"azure site scale mode free challenge24"
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });
  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    grunt.task.run(['shell:scaleSite','shell:gitPush','shell:downScaleSite']);
  });

  grunt.registerTask('deploy', function(){
    grunt.task.run('build');
    if(grunt.option('prod')) {
      grunt.task.run('upload');
    }
    grunt.task.run('server');
  });


};
