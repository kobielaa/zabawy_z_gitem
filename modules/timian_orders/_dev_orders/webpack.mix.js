let mix = require('laravel-mix');

var files = {
  './config/timian_orders.info.yml': './..',
  './config/timian_orders.permissions.yml': './..',
  './config/timian_orders.routing.yml': './..',
  './config/timian_orders.links.menu.yml': './..',
  './config/timian_orders.install': './../',
  './composer.json': './..',
  './controller/OrdersController.php': './../src/Controller',
  './plugin/Block/OrdersBlock.php': './../src/Plugin/Block',
  './plugin/Block/FilterBlock.php': './../src/Plugin/Block',
  './form/OrdersForm.php': './../src/Form',
}

for (var file in files) {
  mix.copy(file, files[file]);
}
// mix.setPublicPath('..');
