import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon } from 'jetswap-uikit-polygon'
import { useTranslation } from 'contexts/Localization'

const CoreTag = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="textSubtle" outline startIcon={<VerifiedIcon />} {...props}>
      {t('Core')}
    </Tag>
  )
}

const CommunityTag = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="textSubtle" outline startIcon={<CommunityIcon />} {...props}>
      {t('Community')}
    </Tag>
  )
}

const PolygonTag = (props) => (
  <Tag variant="binance" outline startIcon={<BinanceIcon />} {...props}>
    Polygon
  </Tag>
)

const DualTag = (props) => (
  <Tag variant="textSubtle" outline {...props}>
    Dual
  </Tag>
)

export { CoreTag, CommunityTag, PolygonTag, DualTag }
