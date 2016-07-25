<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 21.07.2016
 * Time: 17:43
 */

namespace Admin\Model;

use  Zend\View\Renderer\PhpRenderer as Render;
use  Zend\View\Resolver\TemplateMapResolver as Resolver;
use  Zend\View\Model\ViewModel as ViewModel;

class InputOutput
{
    public static function save_file($path_file, $data){
//        if (file_exists($path_file)){
//            $result = date('Y_m_d_H_i_s');
//        }
        $fp = fopen($path_file, "w");
        fwrite($fp, $data);
        fclose($fp);
    }
    public static function packArchive($arch_name,$files_data){
        $filter     = new \Zend\Filter\Compress(array(
            'adapter' => 'Zip',
            'options' => array(
//                'target' => 'C:\temp',
                'archive' => $arch_name.'.zip'
            )
        ));
        if (is_array($files_data)){
            foreach ($files_data as $file_data) {
                $filter->filter($file_data);
            }
        }
    }

    public static function getFileData($file_path, $data_array){
        $render_class = new Render();
        $resolve_class = new Resolver();
        $file_path = realpath($file_path);
        if ($file_path) {
            $resolve_class->setMap(array(
                "code" =>  $file_path
            ));
            $render_class->setResolver($resolve_class);
            $view = new ViewModel($data_array);
            $view->setTemplate("code");

            return $render_class->render($view);// file_get_contents($file_path);
        } else {
            return false;
        }
    }
}