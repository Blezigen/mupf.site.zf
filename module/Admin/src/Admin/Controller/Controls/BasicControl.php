<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 14.07.2016
 * Time: 14:46
 */

namespace Admin\Controller\Controls;


class BasicControl
{
    protected $_setting;

    function __construct($setting)
    {
        $this->_setting = $setting;
    }
    public function _get_default(){ return null; }

    public function _get_echo(){
        $str = get_class($this);
        $temp = explode('\\', $str);
        $class_name = end($temp);
        $setting = $this->_setting;
        $file_path = realpath(__DIR__."/view/".$class_name.".phtml");
        if (file_exists($file_path)) {
            include $file_path;
        }
        else
            return "control not exist";
    }

    public function _the_echo(){
        $str = get_class($this);
        $temp = explode('\\', $str);
        $class_name = end($temp);
        if (file_exists('view/controls/'.$class_name.'.phtml')) {
            echo file_get_contents('view/controls/'.$class_name.'.phtml');
        }
        else
            echo "control not exist";
    }
}