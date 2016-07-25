<?php

namespace Admin\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ZfMupfSites
 *
 * @ORM\Table(name="zf_mupf_sites")
 * @ORM\Entity
 */
class ZfMupfSites
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_mupf_site", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idMupfSite;

    /**
     * @var string
     *
     * @ORM\Column(name="mupf_site_title", type="text", length=65535, nullable=false)
     */
    private $mupfSiteTitle;

    /**
     * @var string
     *
     * @ORM\Column(name="mupf_site_desc", type="text", length=65535, nullable=false)
     */
    private $mupfSiteDesc;

    /**
     * @var string
     *
     * @ORM\Column(name="mupf_site_tags", type="text", length=65535, nullable=false)
     */
    private $mupfSiteTags;

    /**
     * @var string
     *
     * @ORM\Column(name="mupf_site_icon", type="text", length=65535, nullable=false)
     */
    private $mupfSiteIcon;



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
     * Set mupfSiteTitle
     *
     * @param string $mupfSiteTitle
     *
     * @return ZfMupfSites
     */
    public function setMupfSiteTitle($mupfSiteTitle)
    {
        $this->mupfSiteTitle = $mupfSiteTitle;

        return $this;
    }

    /**
     * Get mupfSiteTitle
     *
     * @return string
     */
    public function getMupfSiteTitle()
    {
        return $this->mupfSiteTitle;
    }

    /**
     * Set mupfSiteDesc
     *
     * @param string $mupfSiteDesc
     *
     * @return ZfMupfSites
     */
    public function setMupfSiteDesc($mupfSiteDesc)
    {
        $this->mupfSiteDesc = $mupfSiteDesc;

        return $this;
    }

    /**
     * Get mupfSiteDesc
     *
     * @return string
     */
    public function getMupfSiteDesc()
    {
        return $this->mupfSiteDesc;
    }

    /**
     * Set mupfSiteTags
     *
     * @param string $mupfSiteTags
     *
     * @return ZfMupfSites
     */
    public function setMupfSiteTags($mupfSiteTags)
    {
        $this->mupfSiteTags = $mupfSiteTags;

        return $this;
    }

    /**
     * Get mupfSiteTags
     *
     * @return string
     */
    public function getMupfSiteTags()
    {
        return $this->mupfSiteTags;
    }

    /**
     * Set mupfSiteIcon
     *
     * @param string $mupfSiteIcon
     *
     * @return ZfMupfSites
     */
    public function setMupfSiteIcon($mupfSiteIcon)
    {
        $this->mupfSiteIcon = $mupfSiteIcon;

        return $this;
    }

    /**
     * Get mupfSiteIcon
     *
     * @return string
     */
    public function getMupfSiteIcon()
    {
        return $this->mupfSiteIcon;
    }
}
