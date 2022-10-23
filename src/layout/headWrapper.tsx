import Head from "next/head";

const HeadWrapper = () => {
  return (
    <Head>
      <title>Recipe Builder</title>
      <link rel="icon" href="/fork.png" />
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap');
      </style>
    </Head>
  );
};

export default HeadWrapper;
