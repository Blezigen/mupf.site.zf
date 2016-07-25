<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 21.07.2016
 * Time: 17:09
 */

namespace Admin\Model;

use Admin\Model\AdstractModel as AbstractModel;
use Admin\Model\PackModel as Pack;
use Admin\Model\TemplateModel as Template;
use Zend\Config\Config as Config;

class PackBrowser extends AbstractModel
{

    protected function loadConfig($paths){
        $file_path = realpath($paths."/config.php");
        if ($file_path){
            $config = new Config(include $file_path);
            return $config->toArray();
        }
        return false;
    }

    public function loadPacks(){
        $dir_templates = realpath($this->getPath());
        $handle = opendir ($dir_templates);
        $packs = array();
        while($dir_name = readdir($handle)) {
            if ($dir_name != '.' && $dir_name != '..' && $dir_name != '.htaccess') {
                $pack = new Pack($dir_name);
                $pack->setTitle("");
                $pack->setName($dir_name);
                $pack->setPath($dir_templates);
                $path_image = $this->getPath()."/".$dir_name."/image.png";
                if (realpath($path_image)) {
                    $pack->setImage("/".$path_image);
                }
                $pack_config = $this->loadConfig($this->getPath()."/".$dir_name);
                if ($pack_config){
                    $pack->setTitle($pack_config["config"]["title"]);
                    foreach ($pack_config["templates"] as $key => $value){
                        $template = new Template($pack,$key);
                        $template->setTitle($key);
                        $template->setName($key);
                        $path_image = $this->getPath()."/".$dir_name."/".$key."/image.png";
                        if (realpath($path_image)) {
                            $template->setImage("/".$path_image);
                        }

                        $template->setController($value);
                        $pack->addTemplate($template);
                    }
                }
                $packs["$dir_name"] = $pack;
            }
        }
        $this->setOption("packs",$packs);
    }

    public function getPath(){
        return $this->getOption("path");
    }
    public function setPath($path){
        $this->setOption("path",$path);
    }

    public function getPacks(){
        return $this->getOption("packs");
    }

    public function getPack($name_pack){
        $packs = $this->getOption("packs");
        return $packs[$name_pack];
    }
}