import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Layout from "../../../../components/Layout";

const Cart: NextPage = ({ params }: any) => {
  const product = params.product;
  return <Layout title="Shopping Cart">product = {product}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      params,
    },
  };
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
