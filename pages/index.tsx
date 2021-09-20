import { Grid, Stack, Text, Button, Link, Flex, Image } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import React from "react";
import { api } from "../product/api";
import { Product } from "../product/types";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";

interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<string>(null);
  const text = React.useMemo(() => {
    return cart
      .reduce(
        (message, product) =>
          message.concat(
            `* ${product.title} - ${parseCurrency(product.price)}\n`
          ),
        ``
      )
      .concat(
        `\nTotal: ${parseCurrency(
          cart.reduce((total, product) => total + product.price, 0)
        )}`
      );
  }, [cart]);

  function handleAddToCart(product: Product) {
    setCart((cart) => cart.concat(product));
  }

  return (
    <AnimateSharedLayout type="crossfade">
      <Stack spacing={6}>
        <Grid
          gridGap={6}
          templateColumns="repeat(auto-fill, minmax(240px, 1fr))"
        >
          {products.map((product) => (
            <Stack
              borderRadius="md"
              padding={4}
              key={product.id}
              backgroundColor="gray.100"
              spacing={3}
            >
              <Image
                maxHeight={128}
                as={motion.img}
                borderTopRadius="md"
                cursor="pointer"
                layoutId={product.image}
                objectFit="cover"
                src={product.image}
                alt={product.title}
                onClick={() => setSelectedImage(product.image)}
              />
              <Stack spacing={1}>
                <Text>{product.title}</Text>
                <Text color="green.500" fontSize="sm" fontWeight="500">
                  {parseCurrency(product.price)}
                </Text>
              </Stack>
              <Button
                colorScheme="primary"
                variant="outline"
                size="sm"
                onClick={() => handleAddToCart(product)}
              >
                Agregar
              </Button>
            </Stack>
          ))}
        </Grid>
        {Boolean(cart.length) && (
          <Flex
            as={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            position="sticky"
            bottom={4}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              href={`https://wa.me/595981709001?text=${encodeURIComponent(
                text
              )}`}
              isExternal
              as={Link}
              colorScheme="whatsapp"
              width="fit-content"
              leftIcon={
                <Image
                  src="https://icongr.am/fontawesome/whatsapp.svg?size=32&color=ffffff"
                  alt="Icon"
                />
              }
              size="lg"
            >
              Completar pedido ({cart.length} productos)
            </Button>
          </Flex>
        )}
      </Stack>
      <AnimatePresence>
        {selectedImage && (
          <Flex
            key="backdrop"
            alignItems="center"
            as={motion.div}
            backgroundColor="rgba(0,0,0,0.5)"
            justifyContent="center"
            layoutId={selectedImage}
            position="fixed"
            top={0}
            left={0}
            width="100%"
            onClick={() => setSelectedImage(null)}
          >
            <Image key="image" src={selectedImage} alt={selectedImage} />
          </Flex>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    revalidate: 10,
    props: {
      products: products,
    },
  };
};

export default IndexRoute;
