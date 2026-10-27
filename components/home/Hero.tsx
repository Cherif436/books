import React from 'react'
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className='border-b border-[#DAD3C8]'>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-7xl! md:text-6xl font-bold text-foreground">
            Welcome to The Reading Room
          </h1>
          <p className="text-lg text-[#847062] leading-relaxed">
            A sanctuary for bibliophiles. Discover, share, and discuss the
            written word with fellow readers across the realm.
          </p>

          <Button asChild>
            <Link href="/explore">
              Explore all books <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
