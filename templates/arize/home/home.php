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
            ),
            "text_H1" => array(
                "control" => "TextControl",
                "setup" =>
                    array(
                        "title" => "Тег H1",
                        "option" => "text_H1",
                        "default" => "Заглавный текст",
                        "placeholder" => ""
                    )
            ),
            "sub_text_H1" => array(
                "control" => "TextControl",
                "setup" =>
                    array(
                        "title" => "Подзаголовок",
                        "option" => "sub_text_H1",
                        "default" => "Заглавный текст",
                        "placeholder" => ""
                    )
            ),
            "text_slogan" => array(
                "control" => "TextControl",
                "setup" =>
                    array(
                        "title" => "Слоган",
                        "option" => "text_slogan",
                        "default" => "",
                        "placeholder" => ""
                    )
            ),
            "text_button" => array(
                "control" => "TextControl",
                "setup" =>
                    array(
                        "title" => "Текст кнопки",
                        "option" => "text_button",
                        "default" => "",
                        "placeholder" => ""
                    )
            ),
            "text_color_h1" => array(
                "control" => "ColorPickerControl",
                "setup" =>
                    array(
                        "title" => "Цвет основного текста",
                        "option" => "text_color_h1",
                        "default" => "",
                        "placeholder" => ""
                    )
            ),
            "text_size_h1" => array(
                "control" => "SpinnerControl",
                "setup" =>
                    array(
                        "title" => "Размер основного текста",
                        "option" => "text_size_h1",
                        "default" => "",
                        "placeholder" => ""
                    )
            ),
        );
    }
}