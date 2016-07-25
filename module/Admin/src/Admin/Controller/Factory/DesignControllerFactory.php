<?php
namespace Admin\Controller\Factory;

use Admin\Controller\DesignController as DesignController;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class DesignControllerFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $controllerLocator)
    {
        $serviceLocator = $controllerLocator->getServiceLocator();
//        var_dump($serviceLocator);
        $doctrine = $serviceLocator->get('Doctrine\ORM\EntityManager');
        $result = new DesignController($doctrine);
        $result->setDoctrine($doctrine);
        return $result;
    }

}