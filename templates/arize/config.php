<?php
namespace Templates\Arise;

include_once "b_tab/b_tab.php";
include_once "carousel/carousel.php";
include_once "description/description.php";
include_once "featurette/featurette.php";
include_once "footers/footers.php";
include_once "generic_marketing/generic_marketing.php";
include_once "info/info.php";
include_once "mega_nav/mega_nav.php";
include_once "price/price.php";
include_once "reviews/reviews.php";
include_once "steps/steps.php";
include_once "home/home.php";
include_once "paralax_steps/paralax_steps.php";

$pack_config = array(
    "config" => array(
        "title" => "Набор элементов Arize.", // Название шаблона
        "name" => "arize", // Уникальное наименование шаблона должно совпадать с именем папки
        "styles" => array(
            "bootstrap.theme",
            "bootstrap"
        )
    ),
    "templates" => array( //имя папок подключаемых шаблонов
        "b_tab",
        "carousel",
        "description",
        "featurette",
        "footers",
        "generic_marketing",
        "info",
        "mega_nav",
        "price",
        "reviews",
        "steps",
        "home",
        "paralax_steps"
    )
);

function parseConfig($pack_config){
    $templates = array();
    foreach ($pack_config["templates"] as $template) {
        include_once "{$template}/{$template}.php";
        $class_name = 'Templates\\Arise\\'.$template;
        $templates[$template] = new $class_name();
    }
    $pack_config["templates"] = $templates;
    return $pack_config;
};

return parseConfig($pack_config);


