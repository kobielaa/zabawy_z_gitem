let mix = require('laravel-mix');

var files = {
  './config/timian_common.info.yml': './..',
  './config/timian_common.links.menu.yml': './..',
  './config/timian_common.permissions.yml': './..',
  './config/timian_common.routing.yml': './..',
  './config/timian_common.services.yml': './..',
  './composer.json': './..',
  './services/CommonService.php': './../src/Service',
  './forms/CommonSettingsForm.php': './../src/Form',
  './controller/CommonController.php': './../src/Controller',
};

for (var file in files) {
  mix.copy(file, files[file]);
}
mix.setPublicPath('..');