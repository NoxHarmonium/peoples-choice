import { Header } from "../components/header";
import theme from "../utils/theme";
import { ThemeProvider } from "@material-ui/core";
import ProductHero from "../components/product-hero";
import ProductHowItWorks from "../components/how-it-works";
import Head from "next/head";

const Home = () => (
  <ThemeProvider theme={theme}>
    <Head>
      <title>People's Choice Awards</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    <ProductHero />
    <ProductHowItWorks />
  </ThemeProvider>
);

export default Home;
