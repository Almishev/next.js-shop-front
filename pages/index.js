import Header from "@/components/Header";
import Featured from "@/components/Featured";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";

export default function HomePage({featuredProduct,newProducts}) {
  return (
    <div>
      <Header />
      <HeroVideo />
      {featuredProduct && <Featured product={featuredProduct} />}
      <NewProducts products={newProducts} />
      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  
  // Взимаме featured product ID от settings
  const {Settings} = await import('@/models/Settings');
  const featuredProductSetting = await Settings.findOne({name: 'featuredProductId'});
  const featuredProductId = featuredProductSetting?.value;
  
  let featuredProduct = null;
  if (featuredProductId) {
    featuredProduct = await Product.findById(featuredProductId);
  }
  
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  return {
    props: {
      featuredProduct: featuredProduct ? JSON.parse(JSON.stringify(featuredProduct)) : null,
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}