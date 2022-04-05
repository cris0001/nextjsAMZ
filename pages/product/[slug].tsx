import * as React from "react";
import type { NextPage } from "next";
import Layout from "../../components/Layout";
import NextLink from "next/link";
import Image from "next/image";
import { Grid, Link, List, ListItem, Typography, Card, Button, Badge } from "@material-ui/core";
import useStyles from "../../utils/styles";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import db from "../../utils/db";
import Product from "../../models/Product";
import { useAppContext } from "../../utils/Context";
import { Item } from "../../types";

function ProductPage({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles();

  const { handleAddToCart } = useAppContext();
  if (!product) {
    return <h1>not found</h1>;
  }

  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>back to products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image src={product.image} alt={product.name} width={640} height={640} layout="responsive"></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1">{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography> Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{product.countInStock > 0 ? "In stock" : "Unavailable"}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleAddToCart(product)} fullWidth variant="contained" color="primary">
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default ProductPage;

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{
  props: {
    product: Item;
  };
}> => {
  const slug = context.params?.slug as string;
  await db.connect();
  const product = await Product.find({ slug }).lean();

  console.log(product);
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product[0]),
    },
  };
};
