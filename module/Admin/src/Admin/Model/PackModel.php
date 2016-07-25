<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 21.07.2016
 * Time: 16:43
 */

namespace Admin\Model;

use Admin\Model\AdstractModel as AbstractModel;
use Admin\Model\TemplateModel as Template;

class PackModel extends AbstractModel
{
    function __construct($name_pack)
    {
        $this->setName($name_pack);
        $this->setOption("templates", array());
    }

    public function setTitle($title){
        $this->setOption("title", $title);
    }

    public function getTitle(){
        $this->getOption("title");
    }

    public function setName($name){
        $this->setOption("name",$name);
    }

    public function getName(){
        return $this->getOption("name");
    }

    public function setImage($image){
        $this->setOption("image",$image);
    }

    public function getImage(){
        return $this->getOption("image");
    }

    public function getPath(){
        return $this->getOption("path");
    }

    public function setPath($path){
        $this->setOption("path",$path);
    }

    public function addTemplate(Template $temp){
        $templates = $this->getOption("templates");
        $templates[$temp->getName()] = $temp;
        $this->setOption("templates", $templates);
    }

    public function getTemplate($template_name){
        $templates = $this->getOption("templates");
        return $templates[$template_name];
    }

    public function getTemplates(){
        $templates = $this->getOption("templates");
        return $templates;
    }
}