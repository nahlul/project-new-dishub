import React from 'react';
import { facilities } from '../mockData';
import { ShieldCheck, Users, Clock, MapPin, Wifi, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const iconComponents = {
  ShieldCheck,
  Users,
  Clock,
  MapPin,
  Wifi,
  Smartphone
};

const FacilitiesSection = () => {
  return (
    <section id="facilities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Fasilitas & Keunggulan
          </h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nikmati perjalanan yang nyaman dengan berbagai fasilitas modern yang kami sediakan
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {facilities.map((facility, index) => {
            const IconComponent = iconComponents[facility.icon];
            return (
              <Card 
                key={index} 
                className="border-2 hover:border-emerald-500 hover:shadow-2xl transition-all duration-300 group hover:scale-105 bg-gradient-to-br from-white to-emerald-50/30"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-emerald-100 group-hover:bg-emerald-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                    <IconComponent className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {facility.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {facility.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-600 p-6 rounded-r-xl">
            <h3 className="font-bold text-xl text-gray-900 mb-2">
              Standar Keselamatan Terjamin
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Seluruh armada Trans Koetaradja telah melalui inspeksi keselamatan (rampcheck) dan pemeriksaan berkala. 
              Dilengkapi dengan sopir profesional yang berpengalaman dan terlatih untuk memberikan pelayanan terbaik.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
