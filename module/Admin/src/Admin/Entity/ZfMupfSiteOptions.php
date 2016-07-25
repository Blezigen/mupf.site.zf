<?php

namespace Admin\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ZfMupfSiteOptions
 *
 * @ORM\Table(name="zf_mupf_site_options")
 * @ORM\Entity
 */
class ZfMupfSiteOptions
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_mupf_site_options", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idMupfSiteOptions;

    /**
     * @var integer
     *
     * @ORM\Column(name="id_mupf_site", type="integer", nullable=false)
     */
    private $idMupfSite;

    /**
     * @var string
     *
     * @ORM\Column(name="mupf_option_type", type="string", length=25, nullable=false)
     */
    private $mupfOptionType;

    /**
     * @var string
     *
     * @ORM\Column(name="mupf_option_value", type="text", length=65535, nullable=false)
     */
    private $mupfOptionValue;



    /**
     * Get idMupfSiteOptions
     *
     * @return integer
     */
    public function getIdMupfSiteOptions()
    {
        return $this->idMupfSiteOptions;
    }

    /**
     * Set idMupfSite
     *
     * @param integer $idMupfSite
     *
     * @return ZfMupfSiteOptions
     */
    public function setIdMupfSite($idMupfSite)
    {
        $this->idMupfSite = $idMupfSite;

        return $this;
    }

    /**
     * Get idMupfSite
     *
     * @return integer
     */
    public function getIdMupfSite()
    {
        return $this->idMupfSite;
    }

    /**
     * Set mupfOptionType
     *
     * @param string $mupfOptionType
     *
     * @return ZfMupfSiteOptions
     */
    public function setMupfOptionType($mupfOptionType)
    {
        $this->mupfOptionType = $mupfOptionType;

        return $this;
    }

    /**
     * Get mupfOptionType
     *
     * @return string
     */
    public function getMupfOptionType()
    {
        return $this->mupfOptionType;
    }

    /**
     * Set mupfOptionValue
     *
     * @param string $mupfOptionValue
     *
     * @return ZfMupfSiteOptions
     */
    public function setMupfOptionValue($mupfOptionValue)
    {
        $this->mupfOptionValue = $mupfOptionValue;

        return $this;
    }

    /**
     * Get mupfOptionValue
     *
     * @return string
     */
    public function getMupfOptionValue()
    {
        return $this->mupfOptionValue;
    }
}
