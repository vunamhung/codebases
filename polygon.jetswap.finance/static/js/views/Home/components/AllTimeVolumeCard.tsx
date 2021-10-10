import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from 'jetswap-uikit-polygon'
import { useTranslation } from 'contexts/Localization'
import { useAllTimeVolume } from 'state/hooks'

const StyledAllTimeVolumeCard = styled(Card)`
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
`

const AllTimeVolumeCard = () => {
  const { t } = useTranslation()
  const allTimeVolume = useAllTimeVolume()

  const data = useMemo(() => {
    return allTimeVolume.untrackedVolumeUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }, [allTimeVolume])

  return (
    <StyledAllTimeVolumeCard>
      <CardBody>
        <Heading size="lg" mb="14px">
          {t('All Time Volume')}
        </Heading>
        {data ? (
          <>
            <Heading fontSize="32px" size="lg" color="extra">{`$${data}`}</Heading>
          </>
        ) : (
          <>
            <Skeleton height={66} />
          </>
        )}
      </CardBody>
    </StyledAllTimeVolumeCard>
  )
}

export default AllTimeVolumeCard
