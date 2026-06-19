import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTour, getTourDestinations, getTours } from "@/lib/data";
import { TourDetailClient } from "./TourDetailClient";

interface Props { params: { slug: string }; }

export function generateStaticParams() {
  return getTours().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tour = getTour(params.slug);
  if (!tour) return { title: "线路未找到" };
  return { title: tour.title, description: tour.description };
}

export default function TourDetailPage({ params }: Props) {
  const tour = getTour(params.slug);
  if (!tour) notFound();
  const tourDests = getTourDestinations(tour);
  return <TourDetailClient tour={tour} destinations={tourDests} />;
}
