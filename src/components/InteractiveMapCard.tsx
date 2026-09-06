import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Plus,
  Minus,
  Crosshair,
  Footprints,
  Map as MapIcon,
  ChevronRight,
} from 'lucide-react';
import { CAMPUS_BUILDINGS, DEFAULT_ROUTE } from '../data/campusData';
import { BuildingLocation, CampusRoute } from '../types';
import campusMapImg from '../assets/images/sjec_campus_aerial_map_1788694021011.jpg';

interface InteractiveMapCardProps {
  onOpenFullMap: () => void;
  selectedBuildingId?: string;
  onSelectBuilding?: (building: BuildingLocation) => void;
}

export const InteractiveMapCard: React.FC<InteractiveMapCardProps> = ({
  onOpenFullMap,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeDestination, setActiveDestination] = useState<string>('cse-block');
  const [currentRoute, setCurrentRoute] = useState<CampusRoute>(DEFAULT_ROUTE);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.45));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
  };

  const handleResetLocation = () => {
    setZoomLevel(1);
  };

  const handleSelectBuilding = (b: BuildingLocation) => {
    setActiveDestination(b.id);
    if (b.id === 'cse-block') {
      setCurrentRoute(DEFAULT_ROUTE);
    } else if (b.id === 'library') {
      setCurrentRoute({
        id: 'route-to-lib',
        destinationName: 'Central Library',
        originName: 'Main Block',
        duration: '1 min',
        distance: '90 m',
        steps: [
          'Exit the Main Block east wing',
          'Follow the palm tree covered walkway',
          'Enter Library through the automated glass doorway',
        ],
        pathPoints: [
          { x: 50, y: 58 },
          { x: 42, y: 46 },
          { x: 30, y: 32 },
        ],
      });
    } else if (b.id === 'mechanical-block') {
      setCurrentRoute({
        id: 'route-to-mech',
        destinationName: 'Mechanical Block',
        originName: 'Main Block',
        duration: '3 min',
        distance: '210 m',
        steps: [
          'Pass the administrative lawn south circle',
          'Take the paved roadway past the parking arbor',
          'Mechanical Block workshops are straight ahead',
        ],
        pathPoints: [
          { x: 50, y: 58 },
          { x: 62, y: 52 },
          { x: 72, y: 44 },
        ],
      });
    } else {
      setCurrentRoute({
        id: 'route-to-gate',
        destinationName: b.name,
        originName: 'Main Block',
        duration: '2 min',
        distance: '120 m',
        steps: [
          'Follow the central avenue tree line',
          'Pass the campus reception checkpoint',
          `Arrive at ${b.name}`,
        ],
        pathPoints: [
          { x: 57, y: 38 },
          { x: 52, y: 48 },
          { x: 49, y: 58 },
        ],
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#1E5EFF]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Your Route
            </h3>
          </div>

          {/* Live Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">Live</span>
          </div>
        </div>

        {/* Map Container Viewport */}
        <div className="relative w-full h-72 sm:h-80 md:h-84 rounded-xl overflow-hidden border border-slate-200 bg-slate-800 shadow-inner group">
          {/* Map Layer Image / Satellite View */}
          <div
            className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={campusMapImg}
              alt="SJEC Campus Aerial Map"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-105 brightness-95"
            />
            {/* Green Tint & Aerial Grids Overlay */}
            <div className="absolute inset-0 bg-[#0c2a1a]/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20" />

            {/* SVG Walking Path & Landmarks Overlay */}
            <svg
              viewBox="0 0 100 70"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              {/* Outer glow of the walking route */}
              <path
                d="M 49 58 Q 58 54 55 46 T 52 40 T 57 33 L 67 31"
                fill="none"
                stroke="#1E5EFF"
                strokeWidth="1.8"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />

              {/* Main Dotted Walking Route */}
              <path
                d="M 49 58 Q 58 54 55 46 T 52 40 T 57 33 L 67 31"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1"
                strokeDasharray="1.5 1.5"
                strokeLinecap="round"
                className="animate-dash"
              />

              {/* Walking Person Marker Node */}
              <g transform="translate(54, 46)">
                <circle cx="0" cy="0" r="2.8" fill="#1E5EFF" stroke="#ffffff" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="5" fill="#38BDF8" fillOpacity="0.3" className="animate-ping" />
              </g>

              {/* Turning Point Indicator */}
              <g transform="translate(56.5, 33.5)">
                <circle cx="0" cy="0" r="2.2" fill="#2563EB" stroke="#ffffff" strokeWidth="0.6" />
              </g>
            </svg>

            {/* SJEC Campus Watermark / Logo Top-Left */}
            <div className="absolute top-3 left-3 text-white/90 text-[11px] font-extrabold tracking-widest uppercase bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded pointer-events-none border border-white/10">
              SJEC Campus
            </div>

            {/* Labeled Building Pins on Map */}
            {CAMPUS_BUILDINGS.map((b) => {
              const isTarget = activeDestination === b.id;
              const isMain = b.id === 'main-block';

              return (
                <button
                  key={b.id}
                  onClick={() => handleSelectBuilding(b)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/pin focus:outline-hidden"
                  style={{ left: `${b.xPercent}%`, top: `${b.yPercent}%` }}
                >
                  {/* Destination Pin if Main Block or active */}
                  {isMain && (
                    <div className="flex flex-col items-center -mb-1 animate-bounce">
                      <div className="w-5 h-5 bg-rose-600 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Building Label Pill */}
                  <div
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-tight shadow-md border flex items-center gap-1.5 transition-all duration-200 ${
                      isTarget
                        ? 'bg-[#1E5EFF] text-white border-blue-400 scale-105 shadow-blue-500/40'
                        : 'bg-slate-900/85 hover:bg-slate-900 text-white border-white/20'
                    }`}
                  >
                    <span>{b.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Top-Right: "Walking Route" Pill Button */}
          <div className="absolute top-3 right-3 z-30">
            <div className="bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5 border border-slate-200/60 cursor-pointer transition-colors">
              <Footprints className="w-3.5 h-3.5 text-blue-600" />
              <span>Walking Route</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Bottom-Right: Zoom & Locate Controls */}
          <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-1.5">
            <div className="bg-white/95 backdrop-blur-xs rounded-lg shadow-md border border-slate-200/80 overflow-hidden flex flex-col">
              <button
                id="map-zoom-in"
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors border-b border-slate-200/60 cursor-pointer"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                id="map-zoom-out"
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            <button
              id="map-locate-me"
              onClick={handleResetLocation}
              className="p-2 bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 rounded-lg shadow-md border border-slate-200/80 backdrop-blur-xs transition-colors cursor-pointer"
              title="Locate Me"
              aria-label="Locate Me"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Route Summary Row */}
        <div className="mt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                {currentRoute.destinationName}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                From {currentRoute.originName}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold text-[#1E5EFF]">
              {currentRoute.duration}
            </span>{' '}
            <span className="text-xs text-slate-400 font-medium">
              ({currentRoute.distance})
            </span>
          </div>
        </div>

        {/* Step-by-Step Directions List */}
        <div className="mt-3.5 space-y-2">
          {currentRoute.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
              <span className="font-bold text-slate-800 shrink-0 w-4 text-left">
                {idx + 1}.
              </span>
              <span className="leading-snug">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button: "View on Full Map" */}
      <div className="mt-5 pt-2">
        <button
          id="btn-view-full-map"
          onClick={onOpenFullMap}
          className="w-full bg-[#1E5EFF] hover:bg-[#154ed6] text-white py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer active:scale-98"
        >
          <MapIcon className="w-4 h-4" />
          <span>View on Full Map</span>
        </button>
      </div>
    </div>
  );
};
