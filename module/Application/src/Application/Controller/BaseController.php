<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;

class BaseController extends AbstractActionController
{
    
    /**
     * @var array
     */
    private $_doctrine;
    public function setDoctrine(\Doctrine\ORM\EntityManager $doctrine)
    {
        $this->_doctrine = $doctrine;
    }
    public function getDoctrine()
    {
        return $this->_doctrine;
    }

    /**
     * @param $applicationDetails
     */
    public function __construct()
    {

    }
}
