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

    public static function uploadLocalFile($file_path,$file){
        $file_path = realpath($file_path);
        $file_name = $file['name'];
        $file_path = $file_path . "\\" . $file_name;
        if (move_uploaded_file($file['tmp_name'], $file_path)) {
            return true;
        } else {
            return false;
        }
    }

    public static function uploadWebFile($file_url,$file_path){
        $target_url = $file_url;
        $userAgent = 'Googlebot/2.1 (http://www.googlebot.com/bot.html)';
        $ch = curl_init($target_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
        $output = curl_exec($ch);
        $fh = fopen($file_path, 'w');
        fwrite($fh, $output);
        fclose($fh);

        return true;
    }

    public static function removeFile($file_path){
        $file_path = realpath($file_path);
        if (unlink($file_path)) {
            return true;
        } else {
            return false;
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

    public static function sortFolderByType($a, $b) {
        if ($a['type'] == $b['type']) {
            return 0;
        }
        $return_result = -1;
        if (($a['type'] != "folder") && ($b['type'] == "folder")){
            $return_result = 1;
        }
        if (($b['type'] == "..")){
            $return_result = 1;
        }
        return $return_result;
    }
    public static function getFolders($base_dir="./",$path_data="",$filter_data="",$allowed_depth=-1,$white_rule = null,$black_rule = null){
        $contents=array();

        $base_dir = trim($base_dir);
        $path_data = trim($path_data);
        $filter_data = trim($filter_data);

        // Если переданно в функцию пустая строка превратить ее в родительскую ./
        /*
         * Эту чепуху чуть ниже можно заменить на
         *      if (empty($base_dir)){
         *          $base_dir = "./";
         * Но оставлю как есть
         */
        $base_dir = empty($base_dir)? "./" : $base_dir;
        // В общем проверка на родителей текущей директории
        $base_dir = (substr($base_dir,-1)!="/") ? $base_dir."/" : $base_dir;

        // убирает из пути ../ ./ и преобразует к нормальному пути
        $path_data=$base_dir.str_replace(array("../","./"),"",trim($path_data,"./"));

        // если $path не является директорией преобразуем
        $path_data = !is_dir($path_data) ? dirname($path_data) : $path_data;

        $path_data = (substr($path_data,-1)!="/") ? $path_data."/" : $path_data;

        if($allowed_depth>-1){
            $allowed_depth = count( explode( "/", $base_dir ) ) + $allowed_depth - 1;
            $path_data = implode( "/", array_slice( explode( "/", $path_data ), 0, $allowed_depth ) );
            $path_data = (substr($path_data,-1)!="/") ? $path_data."/" : $path_data;
        }

        $filter = ( empty($filter_data) ) ? array() : explode(",",strtolower($filter_data));

        $files = @scandir($path_data); // извлекаем файлы из пути

        if( !$files ) // Если не нашлось файлов возвращаем пустой заполнитель
            return array("contents"=>array(),"currentPath"=>$path_data);

        for ( $i=0; $i < count( $files ); $i++ ) {
            $file_name=$files[$i];
            $file_path = $path_data.$file_name;

            $is_dir = is_dir($file_path); // является ли путь директорией
            $add = false; //
            $file_type = "folder"; // устанавливаем дефолтное значение типа

            if(!$is_dir){

                $file_type = strtolower( substr( $files[$i], strrpos($files[$i], "." ) + 1 ) ); // Получаем тип файла без точки

                // проверка на черный и белый списки
                if ( isset($white_rule) && !in_array( $file_type, $white_rule ) ) continue;
                if ( isset($black_rule) && in_array( $file_type, $black_rule ) ) continue;

                if( !empty( $filter_data ) ){
                    if( in_array( $file_type, $filter ) ) $add = true;
                }else{
                    $add = true;
                }

            }else{
                if($file_name == ".")continue;
                $add=true;

                if($filter_data!=""){
                    if(!in_array($file_type,$filter))$add=false;
                }

                if($file_name==".."){
                    $file_type = "..";
                    if( $path_data == $base_dir ){
                        $add = false;
                    } else $add = true;

                    $tempar = explode( "/", $file_path );
                    array_splice( $tempar, -2 );
                    $file_path = implode ( "/", $tempar );
                    if ( strlen( $file_path ) <= strlen( $base_dir ) ) $file_path = "";
                }
            }

            if( !empty( $file_path ) ) $file_path = substr( $file_path, strlen($base_dir) );
            if( $add ) {
                $contents[] = array(
                    "path" => $file_path,
                    "name" => $file_name,
                    "type" => $file_type
                );
            }
        }

        usort($contents, 'Admin\Model\InputOutput::sortFolderByType');

        $path_data = ( strlen( $path_data ) <= strlen( $base_dir ) ) ? $path_data = "" : substr( $path_data, strlen( $base_dir ) );
        return array(
            "contents"=>$contents,
            "currentPath"=>$path_data,
            "basePath"=>$base_dir
        );
    }
}