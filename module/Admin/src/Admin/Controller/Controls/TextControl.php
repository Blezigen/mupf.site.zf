<?php
namespace Admin\Controller\Controls;

use Admin\Controller\Controls\BasicControl as BasicControl;

class TextControl extends BasicControl
{
    public function _set_value($value){
        $this->_setting["default"] = $value;
    }

    function __construct($setting)
    {
        parent::__construct($setting);
    }
}