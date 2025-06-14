"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

interface Agency {
  id: number
  name: string
  location: string
  image?: string
  rating: number
  busCount: number
}

export default function BusAgenciesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [agencies, setAgencies] = useState<Agency[]>([])

  useEffect(() => {
    fetch(`${API_BASE_URL}/agencies`)
      .then((res) => res.json())
      .then((data) => setAgencies(data))
      .catch((err) => console.error("Failed to load agencies", err))
  }, [])

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bus Agencies</h1>
          <p className="text-muted-foreground mt-2">Select an agency to view available buses and routes</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agencies by name or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgencies.map((agency) => (
            <Link key={agency.id} href={`/dashboard/bus/${agency.id}`}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <div className="aspect-video relative">
                  <Image src={agency.image || "/placeholder.svg"} alt={agency.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{agency.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {agency.location}
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
                      {agency.rating} ★
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{agency.busCount} buses available</span>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View Buses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
