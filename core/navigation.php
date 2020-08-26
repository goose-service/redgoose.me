<?php
if (!defined('__GOOSE__')) exit();

/**
 * check match uri
 *
 * @param array $matches
 * @return bool
 */
function checkMatchUri($matches=[])
{
  if (count($matches) <= 0) return false;
  foreach ($matches as $k=>$o)
  {
    if (isset($o) && strpos($_SERVER['REQUEST_URI'], $o) !== false)
    {
      return true;
    }
  }
  return false;
}

return [
  (object)[
    'label' => 'Works',
    'link' => '/nest/visual/',
    'target' => '',
    'active' => checkMatchUri(['/nest/visual','/nest/tool']),
    'children' => [
      (object)[
        'label' => 'Visual',
        'link' => '/nest/visual/',
        'target' => '',
        'active' => checkMatchUri(['/nest/visual']),
      ],
      (object)[
        'label' => 'Tool & Service',
        'link' => '/nest/tool/',
        'target' => '',
        'active' => checkMatchUri(['/nest/tool']),
      ],
    ],
  ],
  (object)[
    'label' => 'Photography',
    'link' => '/nest/landscape/',
    'target' => '',
    'active' => checkMatchUri([
      '/nest/landscape',
      '/nest/portrait',
      '/nest/snap',
      '/nest/composition',
      '/nest/foreign-countries'
    ]),
    'children' => [
      (object)[
        'label' => 'Landscape',
        'link' => '/nest/landscape/',
        'target' => '',
        'active' => checkMatchUri(['/nest/landscape']),
      ],
      (object)[
        'label' => 'Portrait',
        'link' => '/nest/portrait/',
        'target' => '',
        'active' => checkMatchUri(['/nest/portrait']),
      ],
      (object)[
        'label' => 'Snap',
        'link' => '/nest/snap/',
        'target' => '',
        'active' => checkMatchUri(['/nest/snap']),
      ],
      (object)[
        'label' => 'Composition',
        'link' => '/nest/composition/',
        'target' => '',
        'active' => checkMatchUri(['/nest/composition']),
      ],
      (object)[
        'label' => 'Foreign countries',
        'link' => '/nest/foreign-countries/',
        'target' => '',
        'active' => checkMatchUri(['/nest/foreign-countries']),
      ],
    ],
  ],
  (object)[
    'label' => 'About',
    'link' => '/page/about/',
    'target' => '',
    'active' => checkMatchUri(['/page/about']),
  ],
  (object)[
    'label' => 'Notes',
    'link' => 'https://note.redgoose.me/',
    'target' => 'redgoose-note',
    'active' => false,
  ],
];