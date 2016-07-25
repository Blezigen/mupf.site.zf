<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 21.07.2016
 * Time: 10:29
 */

namespace Admin\Model;

use \Admin\Model\AdstractModel as AbstractModel;
use \Admin\Model\SiteModel as Site;


class BlockModel extends AbstractModel
{
    function __construct($id){
        $this->setOption("id",$id);
    }

    public function setId($id){
        $this->setOption("id",$id);
    }

    public function getId(){
        return $this->getOption("id");
    }

    public function getNamePack(){
        return $this->getOption("name_pack");
    }
    public function getNameTemplate(){
        return $this->getOption("name_template");
    }

    public function setNamePack($name_pack){
        $this->setOption("name_pack", $name_pack);
    }

    public function setNameTemplate($name_template){
        $this->setOption("name_template", $name_template);
    }

    public function getConfig(){
        return $this->getOption("configuration");
    }

    public function setConfig($config){
        $this->setOption("configuration",$config);
    }
}