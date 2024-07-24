
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Head from 'next/head';
export default function Home() {
  return (
   <div>
    <Head>
     <meta name="google-site-verification" content="TdMZcCgup5n4hjeG2MIGCa8DzJj41atsbr3-gy55xIc" />
      </Head>
  <Header/>
  <Hero/>
   </div>
  );
}
