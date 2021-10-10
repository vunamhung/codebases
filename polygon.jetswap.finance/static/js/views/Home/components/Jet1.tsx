import React from 'react'
import styled, { keyframes } from 'styled-components'

const float = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(10px);
	}
	100% {
		transform: translatey(0px);
	}
`

const StyledBackground = styled.div`
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    background-image: url('/images/assets/jetbg.svg');
  }
`

const Img = styled.img`
  animation: ${float} 4s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`

const Jet1 = () => {
  return (
    <StyledBackground>
      <Img src="/images/assets/jet1.png" alt="jet" />
    </StyledBackground>
  )
}

export default Jet1
