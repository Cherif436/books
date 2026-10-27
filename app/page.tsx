import Hero from "@/components/home/Hero";
import RecentlyAdded from "@/components/home/RecentlyAdded";
import Image from "next/image";

export default function Home() {
  return (
    <div className="pb-10">
      <Hero />
      <RecentlyAdded />
    </div>
  );
}
