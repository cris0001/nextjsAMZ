import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { CardActionArea, Grid, Card, CardMedia, Typography, CardContent, CardActions, Button } from "@material-ui/core";
import Layout from "../../../components/Layout";
import NextLink from "next/link";
import { useAppContext } from "../../../utils/Context";
import Product from "../../../models/Product";
import { Item } from "../../../types";
import db from "../../../utils/db";
import axios from "axios";
import { useEffect } from "react";

const ProductsByCategory: NextPage<{ products: any[] }> = ({ products }) => {
  const { handleAddToCart } = useAppContext();

  return (
    // <Layout title="Shopping Cart">
    //   <Grid container spacing={3}>
    //     {products.map((prod) => (
    //       <Grid item md={4} key={prod.slug}>
    //         <Card>
    //           <NextLink href={`/product/${prod.slug}`} passHref>
    //             <CardActionArea>
    //               <CardMedia component="img" image={prod.image} title={prod.name}></CardMedia>
    //               <CardContent>
    //                 <Typography>{prod.name}</Typography>
    //               </CardContent>
    //             </CardActionArea>
    //           </NextLink>
    //           <CardActions>
    //             <Typography>${prod.price}</Typography>
    //             <Button onClick={() => handleAddToCart(prod)} size="small" color="primary">
    //               Add to cart
    //             </Button>
    //           </CardActions>
    //         </Card>
    //       </Grid>
    //     ))}
    //   </Grid>
    // </Layout>
    <Layout title="Products by category">
      <Grid container spacing={3}>
        {products.map((prod) => (
          <Grid item md={4} key={prod.id}>
            <Card>
              <NextLink href={`/product/${prod.name}`} passHref>
                <CardActionArea>
                  <CardMedia component="img" image={prod.img} title={prod.name}></CardMedia>
                  <CardContent>
                    <Typography>{prod.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </NextLink>
              <CardActions>
                <Typography>${prod.id}</Typography>
                <Button onClick={() => handleAddToCart(prod)} size="small" color="primary">
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // await db.connect();
  // const res = await Product.find({}).lean();
  // const res2 = res.filter((item) => item.gender === params.gender);
  // const res3 = res2.filter((item) => item.category === params.category);
  // const products: Item[] = res3.map(db.convertDocToObj);
  // await db.disconnect();
  const p = await axios.get(`https://retoolapi.dev/YDd2Jo/data?gender=${params.gender}`).then((res) => res.data);
  const products = p.filter((item: any) => item.category === params.category);
  return {
    props: {
      products: products,
    },
  };
};

export default dynamic(() => Promise.resolve(ProductsByCategory), { ssr: false });
