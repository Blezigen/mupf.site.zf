<?php

namespace Admin\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ZfGparserFirmToSubCategory
 *
 * @ORM\Table(name="zf_gparser_firm_to_sub_category")
 * @ORM\Entity
 */
class ZfGparserFirmToSubCategory
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_gparser_firm_to_sub_category", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idGparserFirmToSubCategory;

    /**
     * @var integer
     *
     * @ORM\Column(name="id_gparser_firm", type="integer", nullable=false)
     */
    private $idGparserFirm;

    /**
     * @var integer
     *
     * @ORM\Column(name="id_gparser_sub_category", type="integer", nullable=false)
     */
    private $idGparserSubCategory;



    /**
     * Get idGparserFirmToSubCategory
     *
     * @return integer
     */
    public function getIdGparserFirmToSubCategory()
    {
        return $this->idGparserFirmToSubCategory;
    }

    /**
     * Set idGparserFirm
     *
     * @param integer $idGparserFirm
     *
     * @return ZfGparserFirmToSubCategory
     */
    public function setIdGparserFirm($idGparserFirm)
    {
        $this->idGparserFirm = $idGparserFirm;

        return $this;
    }

    /**
     * Get idGparserFirm
     *
     * @return integer
     */
    public function getIdGparserFirm()
    {
        return $this->idGparserFirm;
    }

    /**
     * Set idGparserSubCategory
     *
     * @param integer $idGparserSubCategory
     *
     * @return ZfGparserFirmToSubCategory
     */
    public function setIdGparserSubCategory($idGparserSubCategory)
    {
        $this->idGparserSubCategory = $idGparserSubCategory;

        return $this;
    }

    /**
     * Get idGparserSubCategory
     *
     * @return integer
     */
    public function getIdGparserSubCategory()
    {
        return $this->idGparserSubCategory;
    }
}
