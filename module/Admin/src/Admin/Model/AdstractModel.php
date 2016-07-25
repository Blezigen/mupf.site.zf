<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 21.07.2016
 * Time: 10:28
 */

namespace Admin\Model;


class AdstractModel
{
    private $_config;

    public function setDoctrine(\Doctrine\ORM\EntityManager $doctrine)
    {
        $this->_config["doctrine"] = $doctrine;
    }

    public function getDoctrine()
    {
        return $this->_config["doctrine"];
    }

    public function setOption($slug, $value){
        $this->_config[$slug] = $value;
    }

    public function getOption($slug){
        if (!is_null($this->_config[$slug])){
            return $this->_config[$slug];
        }
        return false;
    }
}