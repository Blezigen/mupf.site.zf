<?php

namespace Admin;

return array(
    'doctrine' => array(
        'driver' => array(
            // defines an annotation driver with two paths, and names it `my_annotation_driver`
            'admin_entity' => array(
                'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => array(
                    __DIR__.'/../src/Admin/Entity',
                ),
            ),
            'orm_default' => array(
                'drivers' => array(
                    // register `my_annotation_driver` for any entity under namespace `My\Namespace`
                    'Admin\Entity' => 'admin_entity'
                )
            )
        )
    ),
    'controllers' => array(
        'factories'    => array(
            'Admin\Factory\Design'   => \Admin\Controller\Factory\DesignControllerFactory::class,
        ),
        'invokables' => array(
            'Admin\Controller\Index' => \Admin\Controller\IndexController::class,
            'Admin\Controller\Design' => \Admin\Controller\DesignController::class,
        ),
    ),

    'router' => array(
        'routes' => array(
            'admin' => array(
                'type' => 'segment', // отключает подстановки
                'options' => array(
                    'route'    => '/Admin/',
                    'defaults' => array(
                        'controller' => 'Admin\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'design' => array(
                        'type'    => 'segment',
                        'options' => array(
                            'route'    => 'design/[:action]',
                            'defaults' => array(
                                'controller' => 'Admin\Factory\Design',
                                'action'     => 'index',
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),

    'view_manager' => array(
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'admin/design/index'                    => __DIR__ . '/../view/admin/design/index.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),

    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
            ),
        ),
    ),
);
