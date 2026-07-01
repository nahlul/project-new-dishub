import React, { useState } from 'react';
import { routes } from '../mockData';
import { MapPin, Clock, Route, Navigation } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const RoutesSection = () => {
  const getRoutesByType = (type) => {
    if (type === 'all') return routes;
    return routes.filter(route => route.type === type);
  };

  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'koridor': return 'bg-blue-100 text-blue-700';
      case 'feeder': return 'bg-purple-100 text-purple-700';
      case 'campus': return 'bg-orange-100 text-orange-700';
      case 'new': return 'bg-sky-100 text-sky-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'koridor': return 'Koridor';
      case 'feeder': return 'Feeder';
      case 'campus': return 'Trans Kampus';
      case 'new': return 'Rute Baru 2025';
      default: return type;
    }
  };

  return (
    <section  className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Rute & Koridor
          </h2>
          <div className="w-24 h-1 bg-sky-600 mx-auto mb-6" />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trans Koetaradja melayani 14 rute di wilayah Banda Aceh dan Aceh Besar, termasuk 3 rute baru di tahun 2025
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8 h-auto">
            <TabsTrigger value="all" className="py-3">Semua Rute (14)</TabsTrigger>
            <TabsTrigger value="koridor" className="py-3">Koridor (6)</TabsTrigger>
            <TabsTrigger value="feeder" className="py-3">Feeder (4)</TabsTrigger>
            <TabsTrigger value="campus" className="py-3">Trans Kampus (1)</TabsTrigger>
            <TabsTrigger value="new" className="py-3">Rute Baru (3)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <RouteGrid routes={getRoutesByType('all')} getTypeBadgeColor={getTypeBadgeColor} getTypeLabel={getTypeLabel} />
          </TabsContent>
          <TabsContent value="koridor" className="mt-0">
            <RouteGrid routes={getRoutesByType('koridor')} getTypeBadgeColor={getTypeBadgeColor} getTypeLabel={getTypeLabel} />
          </TabsContent>
          <TabsContent value="feeder" className="mt-0">
            <RouteGrid routes={getRoutesByType('feeder')} getTypeBadgeColor={getTypeBadgeColor} getTypeLabel={getTypeLabel} />
          </TabsContent>
          <TabsContent value="campus" className="mt-0">
            <RouteGrid routes={getRoutesByType('campus')} getTypeBadgeColor={getTypeBadgeColor} getTypeLabel={getTypeLabel} />
          </TabsContent>
          <TabsContent value="new" className="mt-0">
            <RouteGrid routes={getRoutesByType('new')} getTypeBadgeColor={getTypeBadgeColor} getTypeLabel={getTypeLabel} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

const RouteGrid = ({ routes, getTypeBadgeColor, getTypeLabel }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {routes.map((route) => (
        <Card key={route.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-sky-500">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                  <Route className="w-5 h-5 text-sky-600" />
                </div>
                <CardTitle className="text-xl">{route.name}</CardTitle>
              </div>
              <Badge className={`${getTypeBadgeColor(route.type)} border-0`}>
                {getTypeLabel(route.type)}
              </Badge>
            </div>
            <CardDescription className="text-base font-medium text-gray-700">
              {route.route}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-600"><span className="font-semibold">Dari:</span> {route.from}</p>
                <p className="text-gray-600"><span className="font-semibold">Ke:</span> {route.to}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <p className="text-gray-600"><span className="font-semibold">Operasional:</span> {route.operational}</p>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <Navigation className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <p className="text-gray-600"><span className="font-semibold">Jarak:</span> {route.distance} <span className="mx-2">•</span> <span className="font-semibold">Durasi:</span> ±{route.duration}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoutesSection;
