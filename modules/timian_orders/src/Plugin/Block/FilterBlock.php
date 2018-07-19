<?php

namespace Drupal\timian_orders\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a Filter Block.
 *
 * @Block(
 *   id = "filter_block",
 *   admin_label = @Translation("Filter Orders block"),
 *   category = @Translation("Orders Block"),
 * )
 */
class FilterBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $form = \Drupal::formBuilder()
      ->getForm('Drupal\timian_orders\Form\OrdersForm');

    return [
      '#markup' => drupal_render($form),
    ];
  }

}
