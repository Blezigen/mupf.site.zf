<?php
namespace Templates\Arise;

class steps
{
    protected $_config;

    public function getConfig(){
        return $this->_config;

    }
    function __construct()
    {
        $this->_config = array(
            "content_height" => array(
                "control" => "SpinnerControl",
                "setup" =>
                    array(
                        "title" => "Высота контента",
                        "option" => "content_height",
                        "default" => "",
                        "placeholder" => ""
                    )
            ),
            "content_color" => array(
                "control" => "ColorPickerControl",
                "setup" =>
                    array(
                        "title" => "Цвет текста",
                        "option" => "content_color",
                        "default" => "ffffff",
                        "placeholder" => ""
                    )
            ),
            "count_column" => array(
                "control" => "SpinnerControl",
                "setup" =>
                    array(
                        "title" => "Колличество колонок",
                        "option" => "count_column",
                        "default" => "",
                        "placeholder" => ""
                    )
            ),
            "content_image" => array(
                "control" => "LoadImageControl",
                "setup" =>
                    array(
                        "title" => "Логотип",
                        "option" => "content_image",
                        "default" => "",
                        "placeholder" => ""
                    )
            )
        );
    }
}