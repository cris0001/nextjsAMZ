import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { CardActionArea, Grid, Card, CardMedia, Typography, CardContent, CardActions, Button } from "@material-ui/core";
import Layout from "../components/Layout";
import NextLink from "next/link";
import db from "../utils/db";
import Product from "../models/Product";
import { useAppContext } from "../utils/Context";
import { Item } from "../types";
import axios from "axios";

// function Home({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) {
const Home: NextPage<{ products: any }> = ({ products }) => {
  const { handleAddToCart } = useAppContext();
  return (
    // <Layout>
    //   <div>
    //     <Grid container spacing={3}>
    //       {products.map((prod) => (
    //         <Grid item md={4} key={prod.slug}>
    //           <Card>
    //             <NextLink href={`/product/${prod.slug}`} passHref>
    //               <CardActionArea>
    //                 <CardMedia component="img" image={prod.image} title={prod.name}></CardMedia>
    //                 <CardContent>
    //                   <Typography>{prod.name}</Typography>
    //                 </CardContent>
    //               </CardActionArea>
    //             </NextLink>
    //             <CardActions>
    //               <Typography>${prod.price}</Typography>
    //               <Button onClick={() => handleAddToCart(prod)} size="small" color="primary">
    //                 add to cart
    //               </Button>
    //             </CardActions>
    //           </Card>
    //         </Grid>
    //       ))}
    //     </Grid>
    //   </div>
    // </Layout>
    <Layout>
      <div>
        <Grid container spacing={3}>
          {products.map((prod: any) => (
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
                    add to cart
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
  // await db.connect();
  // const res = await Product.find().lean();
  // const products: Item[] = res.map(db.convertDocToObj);
  // await db.disconnect();
  const products = await axios.get(`https://retoolapi.dev/YDd2Jo/data`).then((res) => res.data);

  return {
    props: {
      products,
    },
  };
};
