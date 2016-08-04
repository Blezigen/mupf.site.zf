<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 21.07.2016
 * Time: 16:49
 */

namespace Admin\Model;

use Admin\Model\AdstractModel as AdstractModel;
use Admin\Model\PackModel as Pack;
use Admin\Model\InputOutput as IO;

class TemplateModel extends AdstractModel
{
    function __construct(Pack $pack, $name_template)
    {
        $this->setOption("pack", $pack);
        $this->setOption("name", $name_template);
        $this->setOption("configuration", array());
    }

    public function setTitle($title){
        $this->setOption("title", $title);
    }

    public function getTitle(){
        $this->getOption("title");
    }

    public function setController($controller){
        $this->setOption("controller", $controller);
    }

    public function getController(){
        return $this->getOption("controller");
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

    public function parse_config($config) {
        $_config = array();
        if(is_array($config)){
            foreach ($config as $key => $value) {
                if (is_array($value))
                    $_config[$value["option"]] = $value["value"];
                else
                    $_config[$key] = $value;
            }
        }
        return $_config;
    }

    public function getTemplateStyle($args = array()){
        $return_data = "";
        $pack = $this->getOption("pack");
        $path_to_pack = $pack->getPath()."/".$pack->getName()."/".$this->getName()."/".$this->getName().".pcss";
        if ( empty($args) ) return $return_data;
        if ( empty($args["parent"]) ) return $return_data;
        if ( empty($args["base_image_dir"]) ) $args["image_dir"] = $path_to_pack;
        if ( empty($args["option"]) ) $args["option"] = array();
        if ( !realpath($path_to_pack) ) return $return_data;

        $config = $this->parse_config($args["option"]);
        $config["parent"] = $args["parent"];
        $config["base_image_dir"] = $args["base_image_dir"];

        $return_data .= IO::getFileData(realpath($path_to_pack), $config);

        return $return_data;
    }

    public function getTemplateText($args = array()){
        $return_data = "";
        $pack = $this->getOption("pack");
        $path_to_pack = $pack->getPath()."/".$pack->getName()."/".$this->getName()."/".$this->getName().".phtml";

        if ( empty($args) ) return $return_data;
        if ( empty($args["option"]) ) $args["option"] = array();
        if ( !realpath($path_to_pack) ) return $return_data;

        $config = $this->parse_config($args["option"]);
        $config["parent"] = $args["parent"];
        $return_data .= IO::getFileData(realpath($path_to_pack), $config);

        return $return_data;
    }

    public function getControls(){
        $controls = array();
        $option = $this->getController()->getConfig();
        if (is_array($option)) {
            foreach ($option as $key => $value) {
                if (isset($value["control"])) {
                    try
                    {
                        $classControl = 'Admin\\Controller\\Controls\\'.$value["control"];
                        $control = new $classControl($value["setup"]);
                        $controls[$key] = $control;
                    }
                    catch (\Exception $ex){

                    }

                }
            }
        }
        return $controls;
    }

}