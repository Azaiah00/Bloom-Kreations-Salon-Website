import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Proof from "@/components/home/Proof";
import ServicesPreview from "@/components/home/ServicesPreview";
import LocJourney from "@/components/home/LocJourney";
import GalleryRail from "@/components/home/GalleryRail";
import Traveling from "@/components/home/Traveling";
import BookCta from "@/components/home/BookCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Proof />
      <ServicesPreview />
      <LocJourney />
      <GalleryRail />
      <Traveling />
      <BookCta />
    </>
  );
}
