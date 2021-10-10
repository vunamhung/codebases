import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import CompositeImage, { CompositeImageProps } from './CompositeImage'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }  
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }  
`
const SharkWrapper = styled.div`
  display: flex;
  align-items: end;
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(6) {
    animation: ${fading} 3.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const imagePath = '/images/loader/'
const imageSrc = 'pearl'

const starsImage: CompositeImageProps = {
  path: '/images/loader/',
  attributes: [
    { src: 'star-left-1', alt: '3D Star' },
    { src: 'star-left-2', alt: '3D Star' },
    { src: 'star-left-3', alt: '3D Star' },
    { src: 'star-right-1', alt: '3D Star' },
    { src: 'star-right-2', alt: '3D Star' },
  ],
}

const Pearl = () => {
  const { t } = useTranslation()

  return (
    <div style={{ position: 'relative' }}>
      <SharkWrapper>
        <img src={`${imagePath}${imageSrc}.png`} alt={t('A very scary shark')} />
      </SharkWrapper>
      <StarsWrapper>
        <CompositeImage {...starsImage} />
      </StarsWrapper>
    </div>
  )
}

export default Pearl
