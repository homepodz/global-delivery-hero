"use client";

import { WorldMap } from "@/components/WorldMap";

export default function GlobalDelivery() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white">
          Global Delivery
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          We deliver your products worldwide with speed, care, and precision.
        </p>
<div style={{background:'#ffe8e8',color:'#b00020',padding:'8px',textAlign:'center',fontWeight:700}}>
  DEBUG: GlobalDelivery is mounted
</div>

        <WorldMap
          lineColor="#3b82f6"
          animationDuration={2}
          showLabels={true}
          dots={[
            {
              start: { lat: 40.7128, lng: -74.006, label: "New York" },
              end: { lat: 51.5072, lng: -0.1276, label: "London" },
            },
            {
              start: { lat: 51.5072, lng: -0.1276, label: "London" },
              end: { lat: 25.276987, lng: 55.296249, label: "Dubai" },
            },
            {
              start: { lat: 25.276987, lng: 55.296249, label: "Dubai" },
              end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
            },
            {
              start: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
              end: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
            },
            {
              start: { lat: 43.6532, lng: -79.3832, label: "Toronto" },
              end: { lat: 51.5072, lng: -0.1276, label: "London" },
            },
          ]}
        />
      </div>
    </section>
  );
}
