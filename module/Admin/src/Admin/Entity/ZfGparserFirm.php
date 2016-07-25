<?php

namespace Admin\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ZfGparserFirm
 *
 * @ORM\Table(name="zf_gparser_firm", uniqueConstraints={@ORM\UniqueConstraint(name="firm_external_id", columns={"firm_external_id"})})
 * @ORM\Entity
 */
class ZfGparserFirm
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_gparser_firm", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idGparserFirm;

    /**
     * @var string
     *
     * @ORM\Column(name="firm_alias", type="string", length=255, nullable=false)
     */
    private $firmAlias;

    /**
     * @var string
     *
     * @ORM\Column(name="firm_name", type="string", length=255, nullable=false)
     */
    private $firmName;

    /**
     * @var string
     *
     * @ORM\Column(name="firm_city", type="string", length=255, nullable=false)
     */
    private $firmCity;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="firm_insert_date", type="datetime", nullable=false)
     */
    private $firmInsertDate;

    /**
     * @var integer
     *
     * @ORM\Column(name="firm_external_id", type="bigint", nullable=false)
     */
    private $firmExternalId;



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
     * Set firmAlias
     *
     * @param string $firmAlias
     *
     * @return ZfGparserFirm
     */
    public function setFirmAlias($firmAlias)
    {
        $this->firmAlias = $firmAlias;

        return $this;
    }

    /**
     * Get firmAlias
     *
     * @return string
     */
    public function getFirmAlias()
    {
        return $this->firmAlias;
    }

    /**
     * Set firmName
     *
     * @param string $firmName
     *
     * @return ZfGparserFirm
     */
    public function setFirmName($firmName)
    {
        $this->firmName = $firmName;

        return $this;
    }

    /**
     * Get firmName
     *
     * @return string
     */
    public function getFirmName()
    {
        return $this->firmName;
    }

    /**
     * Set firmCity
     *
     * @param string $firmCity
     *
     * @return ZfGparserFirm
     */
    public function setFirmCity($firmCity)
    {
        $this->firmCity = $firmCity;

        return $this;
    }

    /**
     * Get firmCity
     *
     * @return string
     */
    public function getFirmCity()
    {
        return $this->firmCity;
    }

    /**
     * Set firmInsertDate
     *
     * @param \DateTime $firmInsertDate
     *
     * @return ZfGparserFirm
     */
    public function setFirmInsertDate($firmInsertDate)
    {
        $this->firmInsertDate = $firmInsertDate;

        return $this;
    }

    /**
     * Get firmInsertDate
     *
     * @return \DateTime
     */
    public function getFirmInsertDate()
    {
        return $this->firmInsertDate;
    }

    /**
     * Set firmExternalId
     *
     * @param integer $firmExternalId
     *
     * @return ZfGparserFirm
     */
    public function setFirmExternalId($firmExternalId)
    {
        $this->firmExternalId = $firmExternalId;

        return $this;
    }

    /**
     * Get firmExternalId
     *
     * @return integer
     */
    public function getFirmExternalId()
    {
        return $this->firmExternalId;
    }
}
