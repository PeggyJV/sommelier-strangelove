import * as Chakra from '@chakra-ui/react'

export interface KeplrButtonProps extends Omit<Chakra.ButtonProps, 'children'> {
  //
}

const KeplrButton = ({ ...rest }: KeplrButtonProps) => {
  return (
    <Chakra.Button colorScheme='purple'>
      Connect with Keplr
      {/*  */}
    </Chakra.Button>
  )
}

export default KeplrButton
