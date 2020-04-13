import { Header } from "../components/header";
import theme from "../utils/theme";
import ProductHero from "../components/product-hero";
import ProductHowItWorks from "../components/how-it-works";

const Home = () => (
  <>
    <Header />
    <ProductHero />
    <ProductHowItWorks />
  </>
);

export default Home;
