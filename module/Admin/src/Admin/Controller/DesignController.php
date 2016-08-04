<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 15.07.2016
 * Time: 10:49
 */

namespace Admin\Controller;

use Admin\Model\BlockModel;
use Admin\Model\TemplateModel;
use Application\Controller\BaseController as BaseController;
//use Admin\Controller\InputOutputController as IO;
use Admin\Controller\StyleSheetController as CSS;
use Admin\Controller\HyperTextController as HTML;
//use Admin\Controller\PackController as Pack;
use  Zend\View\Renderer\PhpRenderer as Render;
use  Zend\View\Resolver\TemplateMapResolver as Resolver;
use  Zend\View\Model\ViewModel as ViewModel;

use Admin\Model\SiteModel as Site;
use Admin\Model\InputOutput as IO;
use Admin\Model\PackBrowser as PackBrowser;
use Admin\Model\PackModel as Pack;
use Admin\Model\TemplateModel as Template;


class DesignController extends BaseController
{
    protected $_config;
    protected $_site;
    protected $_pack_browser;

    function __construct(\Doctrine\ORM\EntityManager $doctrine)
    {
        $this->setDoctrine($doctrine);

        $this->_pack_browser = new PackBrowser();
        $this->_config = array(
            "scripts" => array(
                "jquery" => "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js",
                "bootstrap" => "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js",
            ),

            "styles" => array(
                "style.autogen" => "layout/css/style.autogen.css",
                "bootstrap" => "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
                "bootstrap.theme" => "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css",
            ),
        );
        $this->_pack_browser->setPath("templates");
        $this->_pack_browser->loadPacks();

        $this->_site = new Site();
        $this->_site->setDoctrine($this->getDoctrine());
        $this->_site->setId(1);
//        $this->_io->save_file("public/css/autogen/blocks.json", json_encode($this->_config["blocks"],JSON_UNESCAPED_UNICODE));
    }

    public function _getSuffix(){
        return $this->_site->getSuffix();// $this->getConfig(1,"suffix");
    }

    public function _view($file){
        $data = $_POST;
        if (file_exists($file))
            include $file;
    }

    public function _getContent($name_pack,$name_template,$config,$id=0){
        $parent = "#".$this->_getSuffix() . $id;
        $pack = $this->_pack_browser->getPack($name_pack);
        $template = $pack->getTemplate($name_template);

//        $config_block = $this->_packController->get_PackConfig($name_pack)->toArray();
        $return_data = "";
        $return_data .= $template->getTemplateText(array("option" => $this->_site->getBlock($id)->getConfig()));
        $return_data .=
            "<style type=\"text/css\">".
            $template->getTemplateStyle(
                array(
                    "option" => $this->_site->getBlock($id)->getConfig(),
                    "parent" => $parent,
                    "base_image_dir" =>  "/temp/image/",
                )
            ).
            "</style>";
        return $return_data;
    }

    public function get_SettingGrid($id_section,$name_pack,$name_template){
        $pack = $this->_pack_browser->getPack($name_pack);
        $template = $pack->getTemplate($name_template);
        $controller = $template->getController();
        $settings =  $template->getControls();

        $grid = "";

        $_config = $this->_site->getBlock($id_section)->getConfig();
        foreach ($settings as $key => $value) {
            $grid .= $value->_set_value($_config[$key]["value"]);
            $grid .= $value->_get_echo();
        }
        return $grid;
    }
    public function save_changes_style(Site $site){
        $blocks = $site->getBlocks();
        $style = "";
        foreach ($blocks as $id => $block) {
            $parent = "#".$site->getSuffix() . $id;
            $pack = $this->_pack_browser->getPack($block->getNamePack());
            $template = $pack->getTemplate($block->getNameTemplate());

            $image_dir = "image/";
            $args = array(
                "parent" => $parent,
                "base_image_dir" => $image_dir,
                "option" => $block->getConfig()
            );
            $css = $template->getTemplateStyle($args);
            //$css = $controller->get_StyleSheet($paths_templates,$parent,$image_dir);
            $style .= $css."\n";
        }
        return $style;
    }
    public function save_changes_html(Site $site){
        $render_class = new Render();
        $resolve_class = new Resolver();
        $file_path = realpath(__DIR__ . "/../../../view/layout/export_layout.phtml");
        if ($file_path) {
            $resolve_class->setMap(array(
                "export_layout" =>  $file_path
            ));
            $render_class->setResolver($resolve_class);

            $blocks = $site->getBlocks();
            $save_data = "";
            foreach ($blocks as $id => $block) {
                $parent = $site->getSuffix() . $id;
                $pack = $this->_pack_browser->getPack($block->getNamePack());
                $template = $pack->getTemplate($block->getNameTemplate());
                $args = array(
                    "option" => $block->getConfig()
                );
                $temp = $template->getTemplateText($args);
                $save_data .= "<section id=\"".$parent."\">".$temp."</section>\n";
            }
            $view = new ViewModel(array("save_data"=>$save_data));
            $view->setTemplate("export_layout");
//            $view->setTerminal(true);
            return $render_class->render($view);// file_get_contents($file_path);
        } else {
            return false;
        }
    }

    public function indexAction(){

        $blocks = $this->_site->getBlocks();
        IO::save_file("temp/style.css", $this->save_changes_style($this->_site));
        IO::save_file("temp/index.html", $this->save_changes_html($this->_site));
        IO::packArchive(
            "site_".$this->_site->getId(),
            array(
                "temp/"
            )
        );
        return array(
            "suffix" => $this->_getSuffix(),
            "blocks" => $blocks,
            "controller" => $this,
        );
    }
    public function getArchiveAction(){

    }
    public function packsAction(){
        $packs = $this->_pack_browser->getPacks();
        $default_image = "/public/img/default_template_image.png";
        $return_data = array();
        foreach ($packs as $pack) {
            $data = array(
                "pack_name" => $pack->getName(),
                "pack_image" => $pack->getImage(),
                "pack_templates" => array()
            );
            $templates = $pack->getTemplates();
            if ($templates != false) {
                foreach ($templates as $template) {
                    $template_data = array(
                        "name_template" => $template->getName(),
                        "image_template" => $template->getImage() ? : $default_image,
                    );
                    $data["pack_templates"][] = $template_data;
                }
            }
            $return_data[] = $data;
        }

        echo json_encode($return_data,JSON_UNESCAPED_UNICODE);
        $viewModel = new ViewModel(array());
        $viewModel->setTerminal(true);
        return $viewModel;
    }

    public function preloaderAction(){
        $viewModel = new ViewModel(array());
        $viewModel->setTerminal(true);
        return $viewModel;
    }

    public function BlockAction(){
        $site = new Site();
        $site->setDoctrine($this->getDoctrine());
        $site->setId(1);
        $_config = $site->getBlocks();

        $request = $this->getRequest();
        $post_data = null;
        $return_data = array();

//        $_config = $this->getConfig(1,"blocks");
//        for ($i = 0; $i<10000000; $i++){}
        if ($request->isXmlHttpRequest()) {
            $post_data = $request->getPost();
            if ($post_data["action"] == "block.get.option"){
                $request = $this->getRequest();
                $post_data = null;
                if ($request->isXmlHttpRequest()) {
                    $post_data = $request->getPost();
                    $block = $this->_site->getBlock($post_data->id_block);
                    $post_data["block"] = $block;
                }
                $return_data["data"] = $post_data;
            }
            else if ($post_data["action"] == "blocks.get"){
                $request = $this->getRequest();
                $post_data = null;
                if ($request->isXmlHttpRequest()) {
                    $post_data = $request->getPost();
                    $blocks = $this->_site->getBlocks();

                    $print_data["count_block"] = count($blocks);
                    $print_data["blocks"] = array();
                    foreach ($blocks as $key => $block){
//                        $block = $this->_site->getBlock($post_data->id_block);
                        $parent = "#".$this->_getSuffix() . $block->getId();
                        $pack = $this->_pack_browser->getPack($block->getNamePack());
                        $template = $pack->getTemplate($block->getNameTemplate());

                        $print_data["blocks"][] = array(
                            "style" => $template->getTemplateStyle(
                                array(
                                    "option" => $block->getConfig(),
                                    "parent" => $parent,
                                    "base_image_dir" =>  "/temp/image/",
                                    )
                            ),
                            "code" => $template->getTemplateText(
                                array(
                                    "option" => $block->getConfig(),
                                    "parent" => $parent
                                )
                            )
                        );

                    }

                }
                $return_data["data"] = $print_data;
            }
            else if ($post_data["action"] == "block.get.style"){
                $request = $this->getRequest();
                $post_data = null;
                if ($request->isXmlHttpRequest()) {
                    $post_data = $request->getPost();
                    $block = $this->_site->getBlock($post_data->id_block);
                    $parent = "#".$this->_getSuffix() . $block->getId();
                    $pack = $this->_pack_browser->getPack($block->getNamePack());
                    $template = $pack->getTemplate($block->getNameTemplate());

                    $post_data["style"] = "<style type=\"text/css\">".
                                                $template->getTemplateStyle(
                                                    array(
                                                        "option" => $block->getConfig(),
                                                        "parent" => $parent,
                                                        "base_image_dir" =>  "/temp/image/",
                                                    )
                                                ).
                                            "</style>";
                }
                $return_data["data"] = $post_data;
            }
            else if ($post_data["action"] == "block.get.code"){
                $request = $this->getRequest();
                $post_data = null;
                if ($request->isXmlHttpRequest()) {
                    $post_data = $request->getPost();
                    $block = $this->_site->getBlock($post_data->id_block);
                    $pack = $this->_pack_browser->getPack($block->getNamePack());
                    $template = $pack->getTemplate($block->getNameTemplate());

                    $post_data["code"]  = $template->getTemplateText(array("option" => $block->getConfig()));
                }
                $return_data["data"] = $post_data;
            }
            else if ($post_data["action"] == "block.set"){
                $id = $post_data["id-section"];
                $return_data["id_section"] = $id;
                if (isset($post_data["options"])) {
                    foreach ($post_data["options"] as $key => $value) {
                        $_block = $site->getBlock($id);
                        $_config = $_block->getConfig();

                        $_config[$value["name"]]["option"] = $value["name"];
                        $_config[$value["name"]]["value"] = $value["value"];

                        $_block->setConfig($_config);
                    };
                    $site->saveBlocks();
//                    $this->saveBlockOption(1,"blocks",$_config);
                }
                $return_data["data"] =  $site->getBlock($id);
            }
            else if ($post_data["action"] == "block.add"){
                $site->addBlock($post_data["name_pack"],$post_data["name_template"],$post_data["insert_position"]);
                $site->saveBlocks();
                $site->reload();
                $return_data["data"] = $site->getBlocks();
            }
            else if ($post_data["action"] == "block.remove"){
                $site->removeBlock($post_data["block_id"]);
                $site->saveBlocks();
                $site->reload();
                $return_data["data"] = $site->getBlocks();
            }
        }
        $viewModel = new ViewModel(array("controller" => $this, "action" => $post_data["action"], "print_data" => $return_data));
        $viewModel->setTerminal(true);
        return $viewModel;
    }

    public function uploadFile(){
        $data = $_POST;
        $dir = __DIR__;
        $upload_dir = realpath("temp/image/");
        $file_type = explode(".",$_FILES[0]['name']);
        $uploadfile = $upload_dir."\\".$this->_getSuffix().$data["id"]."_".$data["hidden"].".".end($file_type);
        if (move_uploaded_file($_FILES[0]['tmp_name'], $uploadfile)) {
            echo json_encode(array("url"=>$this->_getSuffix().$data["id"]."_".$data["hidden"].".".end($file_type)));
        } else {
            echo "Возможная атака с помощью файловой загрузки!\n";
        }
        $viewModel = new ViewModel(array());
        $viewModel->setTerminal(true);
        return $viewModel;

    }

    public function browserAction(){
        $request = $this->getRequest();
        $base_file_path = "tempControl/";
        if ($request->isPost()) {
            $post_data = $request->getPost();
            if($post_data["action"] == "folder.get.all") {
                $path = isset($post_data["path"]) ? $post_data["path"] : "";
                $filter = isset($post_data["filter"]) ? $post_data["filter"] : "";
                $hiddenType = array("htaccess");
                echo json_encode(IO::getFolders($base_file_path, $path, $filter, -1, null, $hiddenType));
            }
            elseif($post_data["action"] == "folder.upload.local") {
                $path = isset($post_data["path"]) ? $post_data["path"] : "";
                $file = $_FILES[0];
                echo json_encode(IO::uploadLocalFile($base_file_path."/".$path,$file));
            }
            elseif($post_data["action"] == "folder.upload.web") {
                $path = isset($post_data["path"]) ? $post_data["path"] : "";
                $target = isset($post_data["target"]) ? $post_data["target"] : "";
                $name = isset($post_data["name"]) ? $post_data["name"] : basename($target);
                echo json_encode(IO::uploadWebFile($target,$base_file_path."/".$path."/".$name));
            }
            elseif($post_data["action"] == "file.remove") {
                $path = isset($post_data["path"]) ? $post_data["path"] : "";
                echo json_encode(IO::removeFile($base_file_path.$path));
            }
        }

        $viewModel = new ViewModel(array());
        $viewModel->setTerminal(true);
        return $viewModel;

    }
}