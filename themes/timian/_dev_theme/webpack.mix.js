let mix = require('laravel-mix');

var files = {
  './code/timian.theme': './..',
  './config/*': './../config/',
  './img/*': './../img/',
  './info/*': './..',
  './tpl/*': './../templates/',
  './node_modules/bootstrap/dist/css/bootstrap.min.css': '../css',
  './node_modules/bootstrap/dist/css/bootstrap.min.css.map': '../css',
  './node_modules/bootstrap/js/src/index.js' : '../js',
  './node_modules/popper.js/dist/popper.js': '../js',
  './node_modules/jquery/dist/jquery.min.js' : '../js',
  './node_modules/jquery/dist/jquery.min.map' : '../js',
  './node_modules/font-awesome':'../fonts/font-awesome',
  './node_modules/datatables.net/js/jquery.dataTables.js': '../js',
  './node_modules/datatables.net-buttons/js/dataTables.buttons.min.js':'../js',
  './node_modules/datatables.net-buttons/js/buttons.html5.min.js': '../js',
  './node_modules/select2/dist/js/select2.min.js': '../js',
  './node_modules/datatables.net-dt/css/jquery.dataTables.css': '../css',
  './node_modules/select2/dist/css/select2.min.css': '../css',
  './node_modules/datatables.net-dt/images/*': '../images',
  './node_modules/@fengyuanchen/datepicker/dist/datepicker.css': '../css',
  './node_modules/@fengyuanchen/datepicker/dist/datepicker.js': '../js',
  './js/datatables_plugins': '../js/datatables_plugins',
}

for (var file in files) {
  mix.copy(file, files[file]);
}
mix.setPublicPath('..');
mix.sass('css/style.scss', 'css');
mix.js('js/timian.js', './../js')
  .sourceMaps();