<?php

namespace Admin\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ZfGparserCategory
 *
 * @ORM\Table(name="zf_gparser_category")
 * @ORM\Entity
 */
class ZfGparserCategory
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_gparser_category", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idGparserCategory;

    /**
     * @var string
     *
     * @ORM\Column(name="category_name", type="string", length=255, nullable=false)
     */
    private $categoryName;

    /**
     * @var integer
     *
     * @ORM\Column(name="category_external_id", type="bigint", nullable=false)
     */
    private $categoryExternalId;



    /**
     * Get idGparserCategory
     *
     * @return integer
     */
    public function getIdGparserCategory()
    {
        return $this->idGparserCategory;
    }

    /**
     * Set categoryName
     *
     * @param string $categoryName
     *
     * @return ZfGparserCategory
     */
    public function setCategoryName($categoryName)
    {
        $this->categoryName = $categoryName;

        return $this;
    }

    /**
     * Get categoryName
     *
     * @return string
     */
    public function getCategoryName()
    {
        return $this->categoryName;
    }

    /**
     * Set categoryExternalId
     *
     * @param integer $categoryExternalId
     *
     * @return ZfGparserCategory
     */
    public function setCategoryExternalId($categoryExternalId)
    {
        $this->categoryExternalId = $categoryExternalId;

        return $this;
    }

    /**
     * Get categoryExternalId
     *
     * @return integer
     */
    public function getCategoryExternalId()
    {
        return $this->categoryExternalId;
    }
}
