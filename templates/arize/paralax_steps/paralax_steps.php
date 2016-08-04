<?php
namespace Templates\Arise;

class paralax_steps
{
    protected $_config;

    public function getConfig(){
        return $this->_config;

    }
    function __construct()
    {
        $this->_config = array(
            "background_back" => array(
                "control" => "LoadImageControl",
                "setup" =>
                    array(
                        "title" => "background_back",
                        "option" => "background_back",
                        "default" => "",
                        "placeholder" => ""
                    )
            ),
            "background_middle" => array(
                "control" => "LoadImageControl",
                "setup" =>
                    array(
                        "title" => "background_middle",
                        "option" => "background_middle",
                        "default" => "",
                        "placeholder" => ""
                    )
            ),
            "background_front" => array(
                "control" => "LoadImageControl",
                "setup" =>
                    array(
                        "title" => "background_front",
                        "option" => "background_front",
                        "default" => "",
                        "placeholder" => ""
                    )
            )
        );
    }
}