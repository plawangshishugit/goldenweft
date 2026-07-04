import Hero from "@/components/home/Hero";
import CoreSeasons from "@/components/home/CoreSeasons";
import ShopByStyle from "@/components/home/ShopByStyle";
import FeaturedArrivals from "@/components/home/FeaturedArrivals";
import SilkAdvisorEntry from "@/components/home/SilkAdvisorEntry";
import LegacyPreview from "@/components/home/LegacyPreview";
import ConfidenceClose from "@/components/home/ConfidenceClose";
import FeaturedSilks from "@/components/home/FeaturedSilk";

export default function Home() {
  return (
    <>
      <Hero />
      <CoreSeasons />
      <ShopByStyle />
      <FeaturedSilks />
      <FeaturedArrivals />
      <SilkAdvisorEntry />
      <LegacyPreview />
      <ConfidenceClose />
    </>
  );
}