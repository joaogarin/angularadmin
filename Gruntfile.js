/*jslint node: true */
"use strict";


module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: './libs',
                    cleanTargetDir: true
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/app.js': [ 'dist/app.js' ]
                },
                options: {
                    mangle: false,
                    preserveComments: 'some'
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'dist/main.css': ['styles/main.css']
                }
            },
            add_banner: {
                options: {
                    banner: '/* My minified admin css file */'
                },
                files: {
                    'dist/main.css': ['dist/main.css']
                }
            }
        },

        html2js: {
            dist: {
                src: [ 'app/views/*.html','app/views/charts/*.html','app/views/forms/*.html','app/views/mail/*.html','app/views/maps/*.html','app/views/pages/*.html','app/views/tables/*.html','app/views/tables/*.html','app/views/tasks/*.html','app/views/ui_elements/*.html' ],
                dest: 'tmp/views.js'
            }
        },

        clean: {
            temp: {
                src: [ 'tmp' ]
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['scripts/vendor/gmap.js',
                    'scripts/vendor/angular.min.js',
                    'scripts/vendor/angular-animate.min.js',
                    'scripts/vendor/angular-route.min.js',
                    'scripts/vendor/underscore-min.js',
                    'scripts/vendor/rocha.js',
                    'scripts/vendor/raphael.min.js',
                    'scripts/vendor/morris.min.js',
                    'scripts/vendor/flot_compiled.js',
                    'scripts/vendor/Chart.min.js',
                    'scripts/vendor/other_charts.js',
                    'scripts/vendor/angular-wizard.js',
                    'scripts/vendor/angular-ui-tree.js',
                    'scripts/vendor/jquery.vmap.min.js',
                    'scripts/extras.js',
                    'app/*.js' ],
                dest: 'dist/app.js'
            }
        },

        jshint: {
            all: [ 'Gruntfile.js', 'app/*.js', 'app/**/*.js' ]
        },

        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8888
                }
            }
        },

        watch: {
            dev: {
                files: [ 'Gruntfile.js', 'app/*.js', '*.html','styles/*.scss' ],
                tasks: [ 'jshint','html2js:dist', 'concat:dist', 'clean:temp','cssmin' ],
                options: {
                    atBegin: true
                }
            },
            min: {
                files: [ 'Gruntfile.js', 'app/*.js', '*.html','styles/*.scss' ],
                tasks: [ 'jshint','html2js:dist', 'concat:dist', 'clean:temp', 'uglify:dist','cssmin' ],
                options: {
                    atBegin: true
                }
            }
        },

        compress: {
            dist: {
                options: {
                    archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                files: [{
                    src: [ 'index.html' ],
                    dest: '/'
                }, {
                    src: [ 'app/**' ],
                    dest: 'app/'
                }, {
                    src: [ 'app/**' ],
                    dest: 'app/'
                }, {
                    src: [ 'app/**' ],
                    dest: 'app/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('dev', [ 'bower', 'connect:server', 'watch:dev' ]);
    grunt.registerTask('test', [ 'bower', 'jshint' ]);
    grunt.registerTask('minified', [ 'bower', 'connect:server', 'watch:min' ]);
};