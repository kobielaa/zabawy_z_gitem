<?php

namespace Drupal\timian_orders\Form;


use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Orders Form
 */
class OrdersForm extends FormBase
{

    /**
     * {@inheritdoc}
     */
    public function getFormId()
    {
        return 'timian_orders_settings_form';
    }

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames()
    {
        return [
            'timian_orders.settings',
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state)
    {
        $purchaser_service = \Drupal::service('timian_common.purchasers');
        $userName = \Drupal::currentUser()->getUsername();
        $purchasers = $purchaser_service->getPurchasersSites($userName);
        $options = [];
        foreach ($purchasers as $purchaser) {
            $options[$purchaser['dir_name']] = $purchaser['dir_name'];
        }

        $form['#prefix'] = '
            <div class="filter-area-wrapper">
            <div class="left-texture">.</div>
            <div class="row padding-50">
            <div id="filter-form-wrapper" class="col-lg-12">';

        $form['#suffix'] = '</div></div></div>';

        $form['purchasers'] = [
            '#prefix'     => '<div class="checkboxes-wrapper col-md-12 col-lg-4">',
            '#type'       => 'select',
            '#title'      => t('Purchasers:'),
            '#options'    => $options,
            '#attributes' => [
                'class'    => ['select-multiple'],
                'name'     => 'states[]',
                'multiple' => 'multiple',
                'id'       => 'purchasers-list',
            ],
        ];
        $form['check_all'] = [
            '#type'       => 'checkboxes',
            '#suffix'     => '</div>',
            '#options'    => [t('Select all purchasers')],
            '#attributes' => [
                'id' => 'all-purchasers-orders',
            ],

        ];
        

        $form['start_date'] = [
            '#prefix'     => '<div class="col-md-12 col-lg-5 delivery-dates">',
            '#type'       => 'textfield',
            '#title'      => t('Delivery dates:'),
            '#attributes' => [
                'placeholder' => [t('From date')],
                'class'       => ['date-picker'],
                'id'          => 'start-date'

            ],
        ];
        $form['end_date'] = [
            '#suffix'     => '</div>',
            '#type'       => 'textfield',
            '#title'      => t('Delivery dates'),
            '#attributes' => [
                'placeholder' => [t('To date')],
                'class'       => ['date-picker'],
                'id'          => 'end-date'
            ],
        ];
        $form['status'] = [
            '#prefix'     => '<div class="col-md-12 col-lg-3">',
            '#suffix'     => '</div>',
            '#type'       => 'select',
            '#title'      => t('Status order:'),
            '#multiple' => TRUE,
            '#options'    => [
                'New',
                'In processing',
                'Received',
                'Approved',
                'Received with remarks'
            ],
            '#attributes' => [
                'class'    => ['select-multiple'],
                'name'     => 'states[]',
                'id'       => 'select-status',
            ],
            '#default_value' => 0

        ];

        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state)
    {
        $config = $this->config('timian_orders.settings');
        $config->set('purchasers', $form_state->getValue('purchasers'))->save();
    }

}
