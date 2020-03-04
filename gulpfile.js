const gulp = require('gulp');
const merge = require('gulp-merge-json');

const bases = {
	src: 'src/',
	dist: 'dist/',
	components: 'api/components/',
	config: 'config/'
};

const paths = {
	policy: 'api/components/**/policy.json',
	html: 'api/components/**/templates/*.html'
};

// Task for copying html templates
gulp.task('copy', () => {
	return gulp.src(paths.html, { cwd: bases.src }).pipe(gulp.dest(bases.components, { cwd: bases.dist }));
});

// Task for merging policies
gulp.task('merge', () => {
	return gulp
		.src(paths.policy, { cwd: bases.src })
		.pipe(merge({ fileName: 'policies.combined.json', concatArrays: true }))
		.pipe(gulp.dest(bases.config, { cwd: bases.dist }));
});
