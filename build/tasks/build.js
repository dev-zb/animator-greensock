var gulp = require('gulp');
var runSequence = require('run-sequence');
var to5 = require('gulp-babel');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var tools = require('aurelia-tools');
var through2 = require('through2');

var jsName = paths.packageName + '.js';

gulp.task('build-index', function(){
  var importsToAdd = [];
  var files = ['effects.js', 'animator.js', 'index.js', jsName].map(function(file){
    return paths.root + file;
  });

  return gulp.src(files)
    .pipe(through2.obj(function(file, enc, callback) {
      file.contents = new Buffer(tools.extractImports(file.contents.toString("utf8"), importsToAdd));
      this.push(file);
      return callback();
    }))
    .pipe(concat(jsName))
    .pipe(insert.transform(function(contents) {
      return tools.createImportBlock(importsToAdd) + contents;
    }))
    .pipe(gulp.dest(paths.output));
});

let moduleTypes = ['es2015','amd','commonjs','system'];
let buildTasks = [];

moduleTypes.forEach( function(mtype) {
  let task = 'build-' + mtype;
  buildTasks.push(task);
  gulp.task(task, function() {
    return gulp.src(paths.source)
               .pipe(to5(assign({}, compilerOptions[mtype]())))
               .pipe(gulp.dest(paths.output + mtype));
  });
})

gulp.task('build-dts', function(){
  return gulp.src(paths.output + paths.packageName + '.d.ts')
      .pipe(rename(paths.packageName + '.d.ts'))
      .pipe(gulp.dest(paths.output + 'es2015'))
      .pipe(gulp.dest(paths.output + 'commonjs'))
      .pipe(gulp.dest(paths.output + 'amd'))  
      .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    'build-index',
    buildTasks,
    'build-dts',
    callback
  );
});