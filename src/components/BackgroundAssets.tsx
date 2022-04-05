import { Box } from '@chakra-ui/react'
import { VFC } from 'react'

export const BackgroundAssets: VFC = () => {
  return (
    <>
      <Box
        pos='absolute'
        w='50%'
        h='100%'
        bgImage='url("/assets/top-left-bg.png")'
        bgRepeat='no-repeat'
        bgSize='contain'
        zIndex='hide'
      />
      <Box
        pos='absolute'
        top='40rem'
        right={0}
        w='50%'
        h='956px'
        bgImage='url("/assets/hexagon.png")'
        bgRepeat='no-repeat'
        bgSize='contain'
        bgPos='right'
        zIndex='hide'
      />
    </>
  )
}
