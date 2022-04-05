import type { InferGetServerSidePropsType, NextPage } from "next";
import { GetServerSideProps } from "next";
import { CardActionArea, Grid, Card, CardMedia, Typography, CardContent, CardActions, Button } from "@material-ui/core";
import Layout from "../components/Layout";
import NextLink from "next/link";
import db from "../utils/db";
import Product from "../models/Product";
import { useAppContext } from "../utils/Context";
import { Item } from "../types";

// function Home({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) {
const Home: NextPage<{ products: Item[] }> = ({ products }) => {
  const { handleAddToCart } = useAppContext();
  return (
    <Layout>
      <div>
        <Grid container spacing={3}>
          {products.map((prod) => (
            <Grid item md={4} key={prod.slug}>
              <Card>
                <NextLink href={`/product/${prod.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia component="img" image={prod.image} title={prod.name}></CardMedia>
                    <CardContent>
                      <Typography>{prod.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${prod.price}</Typography>
                  <Button onClick={() => handleAddToCart(prod)} size="small" color="primary">
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  await db.connect();
  const res = await Product.find({}).lean();
  const products = res.map(db.convertDocToObj);
  await db.disconnect();

  return {
    props: {
      products,
    },
  };
};
