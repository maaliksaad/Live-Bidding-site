"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Car, ArrowRight } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import Link from "next/link";

export function ServerAwarenessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: cars } = useCars();
  const [allEnded, setAllEnded] = useState(false);

  useEffect(() => {
    // Check if modal has been shown in this session
    const hasShown = sessionStorage.getItem("server-awareness-shown");
    if (!hasShown) {
      setIsOpen(true);
      sessionStorage.setItem("server-awareness-shown", "true");
    }
  }, []);

  useEffect(() => {
    if (cars && Array.isArray(cars)) {
      if (cars.length === 0) {
        setAllEnded(true);
        return;
      }
      const now = new Date();
      const hasActive = cars.some((car) => {
        if (!car.endTime) return false;
        const end = new Date(car.endTime);
        return end > now && !car.isCompleted;
      });
      setAllEnded(!hasActive);
    }
  }, [cars]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-none overflow-hidden p-0 shadow-2xl bg-[#0F172A]">
        <div className="relative">
          {/* Animated Gradient Background Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none" />
          
          <div className="relative p-7 space-y-6">
            <DialogHeader className="space-y-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <AlertCircle className="h-6 w-6 text-blue-400" />
                </div>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                  Server Awareness
                </DialogTitle>
              </div>
              <DialogDescription className="text-gray-400 text-base leading-relaxed">
                This project is hosted on a <span className="text-blue-400 font-medium tracking-tight">Free Tier</span> service. 
                If the app has been idle, the server may take <span className="text-white font-semibold">1-2 minutes</span> to "wake up" and respond to requests.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-colors">
                <Clock className="h-5 w-5 text-yellow-400 mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-gray-300">
                  Your patience is appreciated while the server warms up!
                </p>
              </div>

              {allEnded && (
                <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                    <Car className="h-12 w-12 text-indigo-400" />
                  </div>
                  <div className="relative z-10 space-y-3">
                    <h4 className="text-indigo-300 font-semibold flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Auction Update
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      All car bidding time has ended. Ready to start something new?
                    </p>
                    <Link 
                      href="/sell-your-car" 
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-300 transition-colors group/link"
                    >
                      Sell your car & start a new bid
                      <ArrowRight className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-8">
              <DialogClose asChild>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  type="button"
                >
                  Got it, thanks!
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
