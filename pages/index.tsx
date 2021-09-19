import { Grid, Stack, Text, Button, Link, Flex } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import React from "react";
import { api } from "../product/api";
import { Product } from "../product/types";

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
    <Stack spacing={6}>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack
            borderRadius="md"
            padding={4}
            key={product.id}
            backgroundColor="gray.100"
            spacing={3}
          >
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
          position="sticky"
          bottom={4}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            href={`https://wa.me/595981564415?text=${encodeURIComponent(text)}`}
            isExternal
            as={Link}
            colorScheme="whatsapp"
            width="fit-content"
          >
            Completar pedido ({cart.length} productos)
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    revalidate: 10,
    props: {
      products: products,
    },
    // revalidate: 10
  };
};

export default IndexRoute;
