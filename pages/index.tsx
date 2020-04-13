import { Header } from "../components/header";
import theme from "../utils/theme";
import { ThemeProvider } from "@material-ui/core";
import ProductHero from "../components/product-hero";
import ProductHowItWorks from "../components/how-it-works";

const Home = () => (
  <ThemeProvider theme={theme}>
    <Header />
    <ProductHero />
    <ProductHowItWorks />
  </ThemeProvider>
);

export default Home;
