import React from "react";
import { AppProps } from "next/app";
import {
  ChakraProvider,
  Container,
  VStack,
  Image,
  Heading,
  Text,
  Box,
  Divider,
} from "@chakra-ui/react";
import theme from "../theme";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
        <Container
          borderRadius="sm"
          backgroundColor="white"
          boxShadow="md"
          marginY={4}
          maxWidth="container.xl"
          padding={4}
        >
          <VStack>
            <Image
              borderRadius={9999}
              alt="logo"
              src="//placehold.it/128x128"
            />
            <Heading>Almacency</Heading>
            <Text>El almacen de Daniel</Text>
          </VStack>
          <Divider marginY={6} />
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default App;
