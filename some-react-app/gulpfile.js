"use strict";

const gulp = require("gulp");
const HubRegistry = require("gulp-hub");
const conf = require("./config/gulp.conf");

gulp.registry(new HubRegistry([`${conf.paths.tasks}/*.js`]));
