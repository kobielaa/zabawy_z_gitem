<?php

namespace Drupal\timian_orders\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\timian_upload\Storage\DatabaseQueries;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\timian_common\Controller\CommonController;
use Drupal\Core\Database\Database;
use Drupal\timian_sso\Controller\SSOController;
use Drupal\Core\Database\Schema;
use Drupal\views\Views;


/**
 * Provides a 'Orders' Block.
 *
 * @Block(
 *   id = "orders_block",
 *   admin_label = @Translation("Orders block"),
 *   category = @Translation("Orders Block"),
 * )
 */
class OrdersBlock extends BlockBase
{

    /**
     * {@inheritdoc}
     */
    public function build()
    {
        $views = Views::getView('orders');
        $common_service = \Drupal::service('timian_common.purchasers');
        $userName = \Drupal::currentUser()->getUsername();
        $purchasers = $common_service->getPurchasersSites($userName);
        $orders = [];

        foreach ($purchasers as $purchaser) {
            $db = CommonController::connectToDrupal7Database($purchaser['dir_name']);
            if (db_table_exists('field_data_field_user_supplier')) {
                $supplier_value = CommonController::getSupplierId($db, $userName)['supplier_value'];
                $query = $db->select('eldhus_uc_order_fields', 'u');
                $query->innerJoin('uc_orders', 'orders', 'u.order_id = orders.order_id');
                $query->innerJoin('uc_order_statuses', 'statuses', 'orders.order_status = statuses.order_status_id');
                $query->innerJoin('eldhus_divisions', 'd', 'd.id = u.cost_div');
                $query->fields('u')->fields('orders')->fields('d')->fields('statuses')
                    ->condition('supplier_id', $supplier_value)->condition('state', ['post_checkout', 'completed'], 'IN');
                $purchaser_orders = $query->execute()->fetchAll();
            }
            // var_dump($purchaser_orders);
            // die();
            foreach ($purchaser_orders as $order) {
                (strpos($order->data, 'for_review')) ? $order->for_review = 'for_review' : $order->for_review = 'no_review';

                switch ($order->order_status) {
                    case 'pending' :
                        $order->order_status = 'New';
                        break;
                    case 'processing':
                        $order->order_status = 'In processing';
                        break;
                    case 'received':
                        $order->order_status = 'Received';
                        break;
                    case 'completed':
                        $order->order_status = 'Approved';
                        break;

                }

                ($order->order_status == 'Received' && $order->for_review == 'for_review') ? $order->order_status = 'Received with remarks' : $order->order_status;
                $order->purchaser = $purchaser['dir_name'];
                $orders[] = $order;
            }
        }


        Database::setActiveConnection();

        $header = [
            'image'             => '',
            'purchaser'         => t('Purchaser'),
            'id'                => t('No.'),
            'deliver'           => t('Deliver by'),
            'timestamp'         => t('Ordered'),
            'deliver_to'        => t('Deliver to'),
            'status'            => t('Status'),
            'total'             => t('Total'),
            'for_review'        => t('For review'),
            'total_unformatted' => t('Total'),
        ];
        $rows = [];

        foreach ($orders as $order) {
            if (strtoupper($order->currency) == 'ISK') {
                $rows[] = [
                    'data'  => [
                        new FormattableMarkup('<a class="sso-link" data-toggle="modal" data-target="#order-change" data-review="' . $order->for_review . '"  data-purchaser="' . $order->purchaser . '" data-id="' . $order->order_id . '"><i class="fa fa-pencil-square-o"></i></a>', []),
                        $order->purchaser,
                        $order->order_id,
                        date('d/m/Y h:i', $order->delivery_date),
                        date('d/m/Y h:i', $order->created),
                        $order->code,
                        $order->order_status,
                        number_format(ceil($order->order_total), 0, ',', '.') . ', -',
                        $order->for_review,
                        $order->order_total, //not formatted for excel file
                    ],
                    'class' => ['for_review']

                ];
            } else {
                $rows[] = [
                    new FormattableMarkup('<a class="sso-link" data-toggle="modal" data-target="#order-change" data-review="' . $order->for_review . '"  data-purchaser="' . $order->purchaser . '" data-id="' . $order->order_id . '"><i class="fa fa-pencil-square-o"></i></a>', []),
                    $order->purchaser,
                    $order->order_id,
                    date('d/m/Y h:i', $order->delivery_date),
                    date('d/m/Y h:i', $order->created),
                    $order->code,
                    $order->order_status,
                    number_format(ceil($order->order_total), 2, ',', '.'),
                    $order->for_review,
                    $order->order_total, //not formatted for excel file
                ];
            }
        }

        $table = [
            '#type'       => 'table',
            '#header'     => $header,
            '#rows'       => $rows,
            '#attributes' => [
                'id'    => 'orders-table',
                'class' => ['render-table'],
            ],
        ];

        return [
            '#markup' => drupal_render($table),
            '#cache'  => [
                'max-age' => 0,
            ],
        ];
    }
}
