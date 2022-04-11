import React, { useState, useEffect } from "react";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { CardActionArea, Grid, Card, CardMedia, Typography, CardContent, CardActions, Button } from "@material-ui/core";
import Layout from "../../components/Layout";
import NextLink from "next/link";
import { useAppContext } from "../../utils/Context";
import Product from "../../models/Product";
import { Item } from "../../types";
import db from "../../utils/db";
import axios from "axios";

const ProductsGender: NextPage<{ products: any[] }> = ({ products }) => {
  const { handleAddToCart } = useAppContext();
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const filterProducts = () => {
      const tmpData = [...products];
      if (input === "") {
        setFiltered(tmpData);
      } else {
        let temp = tmpData.filter((item) => item.category.toLowerCase().includes(input));
        setFiltered(temp);
      }
    };
    filterProducts();
  }, [input]); //eslint-disable-line

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
    <Layout title="Product by gender">
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <Grid container spacing={3}>
        {filtered.map((prod) => (
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
  // const products: Item[] = res2.map(db.convertDocToObj);
  // await db.disconnect();
  const products = await axios.get(`https://retoolapi.dev/YDd2Jo/data?gender=${params.gender}`).then((res) => res.data);

  return {
    props: {
      products,
    },
  };
};

export default dynamic(() => Promise.resolve(ProductsGender), { ssr: false });
