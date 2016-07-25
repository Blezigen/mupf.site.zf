<?php
namespace Templates\Arise;

class home
{
    protected $_config;

    public function getConfig(){
        return $this->_config;

    }
    function __construct()
    {
        $this->_config = array(
            "backgroung_image" => array(
                "control" => "LoadImageControl",
                "setup" =>
                    array(
                        "title" => "Логотип",
                        "option" => "backgroung_image",
                        "default" => "main_background.jpg",
                        "placeholder" => ""
                    )
            )
        );
    }
}