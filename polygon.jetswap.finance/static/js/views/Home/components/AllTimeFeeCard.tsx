import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton } from 'jetswap-uikit-polygon'
import { useTranslation } from 'contexts/Localization'
import { useAllTimeVolume } from 'state/hooks'

const StyledAllTimeFeeCard = styled(Card)`
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
`

const AllTimeFeeCard = () => {
  const { t } = useTranslation()
  const allTimeVolume = useAllTimeVolume()

  const data = useMemo(() => {
    return (allTimeVolume.untrackedVolumeUSD * 0.001).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }, [allTimeVolume])

  return (
    <StyledAllTimeFeeCard>
      <CardBody>
        <Heading size="lg" mb="14px">
          {t('All Time Fee')}
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
    </StyledAllTimeFeeCard>
  )
}

export default AllTimeFeeCard
