<?php
/**
 * Created by PhpStorm.
 * User: Front
 * Date: 21.07.2016
 * Time: 10:36
 */

namespace Admin\Model;

use Admin\Model\AdstractModel as AdstractModel;
use Admin\Model\BlockModel as Block;

class SiteModel extends AdstractModel
{
    function __construct(){
    }

    public function setId($id){
        $this->setOption( "id", $id );
        $this->reload();
    }

    public function getId(){
        return $this->getOption("id");
    }

    public function getContent(){
        return $this->getOption( "content" );
    }

    protected function isJSON($string) {
        return ( ( is_string( $string ) && ( is_object( json_decode( $string ) ) || is_array(json_decode($string))))) ? true : false;
    }

    public function reload()
    {
        if ( $this->getId() ) {
            $dc = $this->getDoctrine();
            $repository_sites = $dc->getRepository( 'Admin\Entity\ZfMupfSites' );
            $config_site = $repository_sites->findOneBy( array( "idMupfSite" => $this->getId() ) );

            if (isset($config_site)) {
                $this->setOption( "id", $config_site->getIdMupfSite() );
                $this->setOption( "title", $config_site->getMupfSiteTitle() );
                $this->setOption( "description", $config_site->getMupfSiteDesc() );
                $this->setOption( "tags", $config_site->getMupfSiteTags() );
                $this->setOption( "icon", $config_site->getMupfSiteIcon() );

                $repository_site_content = $dc->getRepository( 'Admin\Entity\ZfMupfSiteOptions' );
                $config_content = $repository_site_content->findBy( array( "idMupfSite" => $this->getId() ) );

                if ( isset( $config_content ) ) {
                    $config_data = array();
                    foreach ( $config_content as $key => $config ) {
                        if ( $this->isJSON( $config->getMupfOptionValue() ) )
                            $config_data[ $config->getMupfOptionType() ] = json_decode( $config->getMupfOptionValue(), true );
                        else
                            $config_data[ $config->getMupfOptionType() ] = $config->getMupfOptionValue();
                    }

                    if (is_array($config_data["blocks"])){
                        $return_data = array();
                        foreach ( $config_data["blocks"] as $key => $block_content ) {
                            $block = new Block($key);
                            $block->setNamePack($block_content["name_pack"]);
                            $block->setNameTemplate($block_content["name_template"]);
                            $block->setConfig($block_content["configuration"]);
                            $return_data[] = $block;
                        }
                        $config_data["blocks"] = $return_data;
                    }

                    $this->setOption( "content", $config_data );
                    return true;
                }
            }
        }
        return false;
    }

    public function saveBlocks(){
        $dc = $this->getDoctrine();
        $repository_options = $dc->getRepository('\Admin\Entity\ZfMupfSiteOptions');
        $_config = $repository_options->findOneBy(array("idMupfSite" => $this->getId(),"mupfOptionType" => "blocks"));
        $data = array();
        foreach ($this->getBlocks() as $block) {
//            $block  = new \Admin\Model\BlockModel();//$block;
            $data[] = array(
                "name_pack" => $block->getNamePack(),
                "name_template" => $block->getNameTemplate(),
                "configuration" => $block->getConfig()
            );
        }
        $_config->setMupfOptionValue(json_encode($data,JSON_UNESCAPED_UNICODE));
        $dc->flush();
    }

    public function addBlock($name_pack,$name_template,$position = 1){
        $config = $this->getOption("content");
        $blocks_content = $this->getBlocks();
        $block = new Block($position);
        $block->setNamePack($name_pack);
        $block->setNameTemplate($name_template);
        $block->setConfig(array());
        $block_Arr_add = array($block);
        array_splice( $blocks_content, $position, 0, $block_Arr_add);
        $config["blocks"] = $blocks_content;
        $this->setOption("content",$config);
    }

    public function removeBlock($remove_id){
        $config = $this->getOption("content");
        $blocks_content = $this->getBlocks();
        array_splice( $blocks_content, $remove_id, 1);
        $config["blocks"] = $blocks_content;
        $this->setOption("content",$config);
    }

    public function getBlocks(){
        $blocks_content = $this->getOption("content");
        return $blocks_content["blocks"];
    }

    public function getSuffix(){
        $blocks_content = $this->getOption("content");
        $return_data = $blocks_content["suffix"];
        return $return_data;
    }
    public function getBlock($id){
        $return_data = array();
        $blocks_content = $this->getOption("content");
        return $blocks_content["blocks"][$id];
    }
}