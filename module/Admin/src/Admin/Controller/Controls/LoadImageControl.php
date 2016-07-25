<?php
namespace Admin\Controller\Controls;

use Admin\Controller\Controls\BasicControl as BasicControl;

class LoadImageControl extends BasicControl
{
    public function _get_default(){
        return "img/zf2-logo.png";
    }

    public function _set_value($value){
        if (!isset($value))
            $value = $this->_get_default();
        $this->_setting["default"] = $value;
    }

    function __construct($setting)
    {
        parent::__construct($setting);
    }
}