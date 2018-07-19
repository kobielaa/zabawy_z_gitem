<?php

namespace Drupal\timian_common\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Timian Common settings.
 */
class CommonSettingsForm extends ConfigFormBase
{

    /**
     * {@inheritdoc}
     */
    public function getFormId()
    {
        return 'timian_common_settings_form';
    }

    /**
     * {@inheritdoc}
     */
    protected function getEditableConfigNames()
    {
        return [
            'timian_common.settings',
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state)
    {
        $config = $this->config('timian_common.settings');

        $form['base_url'] = [
            '#type'          => 'textfield',
            '#title'         => t('Base URL'),
            '#default_value' => $config->get('base_url'),
            '#description'   => t('For example: -dev.timian.is for http://purchaser1-dev.timian.is'),
        ];
        $form['base_root'] = [
            '#type'          => 'textfield',
            '#title'         => t('Base root'),
            '#default_value' => $config->get('base_root'),
            '#description'   => t('Where to look for purchaser\'s sites directories, for example: /var/www/vhosts/'),
        ];
        $form['redirect_url'] = [
            '#type'          => 'textfield',
            '#title'         => t('Redirect url'),
            '#default_value' => $config->get('redirect_url'),
            '#description'   => t('For example: suppliers/orders'),
        ];
        $form['local_port'] = [
            '#type'          => 'textfield',
            '#title'         => t('Local port'),
            '#default_value' => $config->get('local_port'),
            '#description'   => t('For example: :8080'),
        ];
        $form['environment'] = [
            '#type'          => 'radios',
            '#title'         => t('Environment'),
            '#default_value' => $config->get('environment'),
            '#options'       => [
                1 => t('Remote server'),
                2 => t('Local server'),
            ],
        ];

        return parent::buildForm($form, $form_state);
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state)
    {
        $config = $this->config('timian_common.settings');
        $config->set('base_url', $form_state->getValue('base_url'))->save();
        $config->set('base_root', $form_state->getValue('base_root'))->save();
        $config->set('redirect_url', $form_state->getValue('redirect_url'))->save();
        $config->set('local_port', $form_state->getValue('local_port'))->save();
        $config->set('environment', $form_state->getValue('environment'))->save();
    }

}
