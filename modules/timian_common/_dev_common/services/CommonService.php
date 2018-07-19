<?php

namespace Drupal\timian_common\Service;

use Drupal\user\Entity\User as User;

/**
 * Purchasers service.
 */
class CommonService
{

    /**
     * Returns provided input.
     *
     * @param string $input
     *   Input string.
     *
     * @return string
     *   Provided input with comment.
     */
    public function testService($input)
    {
        return 'Provided input: ' . $input;
    }

    /**
     * Returns purchaser's sites for given supplier.
     *
     * @param string $supplierName
     *   Supplier's name.
     *
     * @return array
     *   Purchaser's sites list.
     */
    public function getPurchasersSites($supplierName)
    {
        $config = \Drupal::config('timian_common.settings');
        $environment = $config->get('environment');
        $dirList = $this->getDirList($config->get('base_root'));
        $purchasers = [];
        foreach ($dirList as $dir) {
            $output = [];
            exec('drush user-information "' . $supplierName . '" --root=' . $config->get('base_root') . $dir['name'], $output);
            if (count($output) == 0) {
                continue;
            }
            $output = [];
            // Drush 6.x specific.
            // For Drush 8 use 'drush config-get system.site name'.
            if ($environment == 1) {
                // For production like enviroment.
                exec('drush variable-get timian_purchaser_name --root=' . $config->get('base_root') . $dir['name'], $output);
            } else if ($environment == 2) {
                // For local development.
                exec('drush variable-get site_name --root=' . $config->get('base_root') . $dir['name'], $output);
            }

            $purchasers[] = [
                'dir_name'  => $dir['name'],
                'site_name' => str_replace('\'', '', trim(explode(':', $output[0])[1])),
            ];
        }
        return $purchasers;
    }

    /**
     * Returns directories list inside given directory.
     *
     * @param string $dir
     *   Directory name.
     *
     * @return array
     *   Directories list.
     */
    public function getDirList($dir)
    {
        $retval = [];
        // modified: we must be careful here about allowing the script to traverse directories above it's default
        // so for the time being we will have structure containing the directories storing the purhcaser sites. This
        // structure can be maintained by the site wide init-script.
        $purchaser_roots = \Drupal::state()->get(
            'purchaser_roots',
            ['purchaser1', 'purchaser2', 'purchaser3', 'purchaser4']
        );
        foreach ($purchaser_roots as $entry) {
            $retval[] = [
                'name' => $entry,
            ];
        }
        return $retval;
    }

    /**
     * Get one-time-login link.
     *
     * @param string $purchaser
     *   Purchaser directory name.
     * @param int $userId
     *   User ID.
     *
     * @return array
     *   Link array.
     */
    public function getLoginLink($purchaser, $redirectUrl, $userId = null)
    {
        $config = \Drupal::config('timian_common.settings');

        if (!isset($userId)) {
            $userName = \Drupal::currentUser()->getUsername();
        } else {
            $userName = User::load($userId)->get('name')->value;
        }

        $baseUrl = $config->get('base_url');
        $baseRoot = $config->get('base_root');
        $environment = $config->get('environment');

        $loginLink = [];
        if ($environment == 1) {
            // For production like enviroment.
            exec('drush --uri=https://' . $purchaser . $baseUrl .
                ' --root=' . $baseRoot . $purchaser .
                ' user-login  --name="' . $userName .
                '" --browser=Fakebrowser ' . $redirectUrl, $loginLink);
        } else if ($environment == 2) {
            // For local development.
            exec('drush --uri=http://' . $baseUrl . $purchaser .
                ' --root=' . $baseRoot . $purchaser .
                ' user-login --name="' . $userName .
                '" --browser=Fakebrowser ' . $redirectUrl, $loginLink);
        }

        return $loginLink;
    }
}
