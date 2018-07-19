<?php

namespace Drupal\timian_common\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\timian_upload\Controller\UploadController;
use Drupal\Core\Database\Database;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Drupal\timian_upload\Storage\DatabaseQueries;

/**
 * Common methods for all modules
 */
class CommonController extends ControllerBase
{

    /**
     * Get supplier id and value form databeses in drupal 7 instances
     *
     * @param object $db
     *   Database connection to drupal 7 instance
     *
     * @param string $userName
     *   Name of currently login user (drupal 8)
     *
     * @return array
     *  Supplier value and id
     */
    public static function getSupplierId($db, $userName)
    {

        $uid = $db->select('users', 'u')
                   ->fields('u', ['uid'])
                   ->condition('name', $userName)
                   ->execute()
                   ->fetchAll()[0]->uid;

        $supplier_value = $db->select('field_data_field_user_supplier', 'us')
                              ->fields('us', ['field_user_supplier_value'])
                              ->condition('entity_id', $uid)
                              ->execute()
                              ->fetchAll()[0]->field_user_supplier_value;

        return [
            'supplier_value' => $supplier_value,
            'uid'            => $uid,
        ];
    }

    /**
     * Get filname of uploaded file
     *
     * @param int $fid
     *   File ID
     *
     * @return string
     *   Name of uploaded file without extension
     */
    public static function getFileName($fid)
    {
        $upload_file_path = drupal_realpath(DatabaseQueries::getFilePath($fid));
        $file_name = explode('.', $upload_file_path)[0];
        return $file_name;
    }

    /**
     * Connect to databases of drupal 7 instances
     *
     * @param string $purchaser
     *    Pruchaser directory name
     *
     * @return object
     *   Database connection object
     */
    public static function connectToDrupal7Database($purchaser)
    {
        $config = \Drupal::config('timian_common.settings');
        $settingsPath = $config->get('base_root') . $purchaser . '/sites/default/settings.php';
        ob_start();
        include $settingsPath;
        ob_end_clean();
        $db_settings = $databases['default']['default'];
        Database::addConnectionInfo($db_settings['database'], 'default', $db_settings);
        Database::setActiveConnection($db_settings['database']);
        $db = Database::getConnection();
        return $db;
    }

    /**
     * Parsing .csv .xls .xlsx files.
     *
     * @param string $uploadFilePath
     *   File path.
     *
     * @return array
     *   Spreadsheet file rows.
     */
    public static function parseFile($uploadFilePath)
    {
        $dataSource = IOFactory::load($uploadFilePath);
        $sheet = $dataSource->setActiveSheetIndex(0);
        $allRows = $sheet->toArray(null, true, false, false);
        return $allRows;
    }

    /**
     * Return purchasers list
     *
     * @return array
     */
    public static function getPurchasers(){
        $config = \Drupal::config('timian_common.settings');
        $purchaser_service = \Drupal::service('timian_common.purchasers');
        $purchasers_list = $purchaser_service->getDirList($config->get('base_root'));
        $options = [];
        foreach ($purchasers_list as $purchaser) {
            $options[$purchaser['name']] = $purchaser['name'];
        }
        return $options;
    }
}