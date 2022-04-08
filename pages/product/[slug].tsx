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
import axios from "axios";

function ProductPage({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles();
  console.log(product);

  const { handleAddToCart } = useAppContext();
  if (!product) {
    return <h1>not found</h1>;
  }

  return (
    // <Layout title={product.name} description={product.description}>
    //   <div className={classes.section}>
    //     <NextLink href="/" passHref>
    //       <Link>
    //         <Typography>back to products</Typography>
    //       </Link>
    //     </NextLink>
    //   </div>
    //   <Grid container spacing={1}>
    //     <Grid item md={6} xs={12}>
    //       <Image src={product.image} alt={product.name} width={640} height={640} layout="responsive"></Image>
    //     </Grid>
    //     <Grid item md={3} xs={12}>
    //       <List>
    //         <ListItem>
    //           <Typography component="h1">{product.name}</Typography>
    //         </ListItem>
    //         <ListItem>
    //           <Typography>Category: {product.category}</Typography>
    //         </ListItem>
    //         <ListItem>
    //           <Typography>Brand: {product.brand}</Typography>
    //         </ListItem>
    //         <ListItem>
    //           <Typography>
    //             Rating: {product.rating} stars ({product.numReviews} reviews)
    //           </Typography>
    //         </ListItem>
    //         <ListItem>
    //           <Typography> Description: {product.description}</Typography>
    //         </ListItem>
    //       </List>
    //     </Grid>
    //     <Grid item md={3} xs={12}>
    //       <Card>
    //         <List>
    //           <ListItem>
    //             <Grid container>
    //               <Grid item xs={6}>
    //                 <Typography>Price</Typography>
    //               </Grid>
    //               <Grid item xs={6}>
    //                 <Typography>${product.price}</Typography>
    //               </Grid>
    //             </Grid>
    //           </ListItem>
    //           <ListItem>
    //             <Grid container>
    //               <Grid item xs={6}>
    //                 <Typography>Status</Typography>
    //               </Grid>
    //               <Grid item xs={6}>
    //                 <Typography>{product.countInStock > 0 ? "In stock" : "Unavailable"}</Typography>
    //               </Grid>
    //             </Grid>
    //           </ListItem>
    //           <ListItem>
    //             <Button onClick={() => handleAddToCart(product)} fullWidth variant="contained" color="primary">
    //               Add to cart
    //             </Button>
    //           </ListItem>
    //         </List>
    //       </Card>
    //     </Grid>
    //   </Grid>
    // </Layout>
    <Layout title={product.name} description={product.name}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>back to products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image src={product.img} alt={product.name} width={640} height={640} layout="responsive"></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1">name: {product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>brand: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                rating: {product.id} stars ({product.id} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                description: {product.category}-{product.id}-{product.name}
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.id}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{product.id > 0 ? "In stock" : "Unavailable"}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button onClick={() => handleAddToCart(product[0])} fullWidth variant="contained" color="primary">
                  add to cart
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
    product: any;
  };
}> => {
  const slug = context.params?.slug as string;
  const product = await axios.get(`https://retoolapi.dev/YDd2Jo/data?name=${slug}`).then((res) => res.data);

  return {
    props: {
      product: product[0],
    },
  };
  // await db.connect();
  // const product = await Product.find({ slug }).lean();

  // console.log(product);
  // await db.disconnect();
  // return {
  //   props: {
  //     product: db.convertDocToObj(product[0]),
  //   },
  // };
};
