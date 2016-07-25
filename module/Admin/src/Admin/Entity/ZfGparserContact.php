<?php

namespace Admin\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ZfGparserContact
 *
 * @ORM\Table(name="zf_gparser_contact")
 * @ORM\Entity
 */
class ZfGparserContact
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_gparser_contact", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idGparserContact;

    /**
     * @var integer
     *
     * @ORM\Column(name="id_gparser_firm", type="integer", nullable=false)
     */
    private $idGparserFirm;

    /**
     * @var string
     *
     * @ORM\Column(name="contact_type", type="string", length=20, nullable=false)
     */
    private $contactType;

    /**
     * @var string
     *
     * @ORM\Column(name="contact_value", type="string", length=255, nullable=false)
     */
    private $contactValue;

    /**
     * @var string
     *
     * @ORM\Column(name="contact_data", type="string", length=255, nullable=false)
     */
    private $contactData;



    /**
     * Get idGparserContact
     *
     * @return integer
     */
    public function getIdGparserContact()
    {
        return $this->idGparserContact;
    }

    /**
     * Set idGparserFirm
     *
     * @param integer $idGparserFirm
     *
     * @return ZfGparserContact
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
     * Set contactType
     *
     * @param string $contactType
     *
     * @return ZfGparserContact
     */
    public function setContactType($contactType)
    {
        $this->contactType = $contactType;

        return $this;
    }

    /**
     * Get contactType
     *
     * @return string
     */
    public function getContactType()
    {
        return $this->contactType;
    }

    /**
     * Set contactValue
     *
     * @param string $contactValue
     *
     * @return ZfGparserContact
     */
    public function setContactValue($contactValue)
    {
        $this->contactValue = $contactValue;

        return $this;
    }

    /**
     * Get contactValue
     *
     * @return string
     */
    public function getContactValue()
    {
        return $this->contactValue;
    }

    /**
     * Set contactData
     *
     * @param string $contactData
     *
     * @return ZfGparserContact
     */
    public function setContactData($contactData)
    {
        $this->contactData = $contactData;

        return $this;
    }

    /**
     * Get contactData
     *
     * @return string
     */
    public function getContactData()
    {
        return $this->contactData;
    }
}
