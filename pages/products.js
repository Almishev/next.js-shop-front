import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Footer from "@/components/Footer";

export default function ProductsPage({products}) {
  console.log('ProductsPage received products:', products);
  return (
    <>
      <Header />
      <Center>
        <Title>All products</Title>
        {products.length === 0 ? (
          <div>No products found. Total: {products.length}</div>
        ) : (
          <ProductsGrid products={products} />
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('MONGODB_URI value:', process.env.MONGODB_URI);
    await mongooseConnect();
    console.log('Connected to MongoDB successfully');
    
    // Проверяваме всички колекции
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Проверяваме всички бази данни
    const admin = db.admin();
    const databases = await admin.listDatabases();
    console.log('Available databases:', databases.databases.map(d => d.name));
    
    // Опитваме се да се свържем към ecommerce-admin базата
    if (!databases.databases.find(d => d.name === 'ecommerce-admin')) {
      console.log('ecommerce-admin database not found in current connection');
      console.log('Current database name:', db.databaseName);
    } else {
      console.log('Connected to ecommerce-admin database successfully');
    }
    
    // Проверяваме всички колекции в текущата база
    console.log('All collections in current database:', collections.map(c => c.name));
    
    // Проверяваме всички възможни имена на колекции
    const possibleCollectionNames = ['products', 'Products', 'product', 'Product'];
    
    for (const collectionName of possibleCollectionNames) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`Products count in ${collectionName} collection:`, count);
        
        if (count > 0) {
          const productsFromDB = await collection.find({}).toArray();
          console.log(`Found products in ${collectionName} collection:`, productsFromDB.length);
          console.log('First product:', productsFromDB[0]?.title || 'No title');
          return {
            props:{
              products: JSON.parse(JSON.stringify(productsFromDB)),
            }
          };
        }
      } catch (error) {
        console.log(`Collection ${collectionName} does not exist`);
      }
    }
    
    const products = await Product.find({}, null, {sort:{'_id':-1}});
    console.log('Products found:', products.length);
    if (products.length > 0) {
      console.log('First product:', products[0].title);
    }
    return {
      props:{
        products: JSON.parse(JSON.stringify(products)),
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return {
      props:{
        products: [],
      }
    };
  }
}