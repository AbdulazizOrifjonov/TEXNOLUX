import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Search, Check, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DEFAULT_BUKHARA_COORDS = [39.7747, 64.4286]; // Bukhara center [lat, lon]

// Custom vibrant brand pin matching NSB Bukhara (#e11b6e)
const createPinIcon = () => {
  return L.divIcon({
    className: 'nsb-map-custom-marker',
    html: `
      <div style="position: relative; width: 40px; height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
        <div style="
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #27272a 0%, #09090b 60%, #000000 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
          border: 3px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          transition: transform 0.15s ease;
        ">
          <div style="
            width: 14px;
            height: 14px;
            background: #ffffff;
            border-radius: 50%;
            transform: rotate(45deg);
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          "></div>
        </div>
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 6px;
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%);
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48]
  });
};

export default function YandexMapPicker({
  initialCoords,
  onAddressSelected,
  apartmentDetail,
  onApartmentChange
}) {
  const { t } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const [coords, setCoords] = useState(
    initialCoords?.lat && initialCoords?.lon
      ? [initialCoords.lat, initialCoords.lon]
      : DEFAULT_BUKHARA_COORDS
  );
  const [detectedAddress, setDetectedAddress] = useState('Buxoro shahri');
  const [detectedCity, setDetectedCity] = useState('Buxoro shahri');

  // Reverse Geocoding via Nominatim
  const reverseGeocode = async (lat, lon) => {
    setGeocoding(true);
    const yandexUrl = `https://yandex.uz/maps/?pt=${lon},${lat}&z=17&l=map`;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=uz,ru,en`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const addr = data.address || {};

        let road = addr.road || addr.street || addr.pedestrian || addr.footway || '';
        let houseNumber = addr.house_number || '';
        let neighborhood = addr.neighbourhood || addr.suburb || addr.quarter || addr.residential || '';
        let city = addr.city || addr.town || addr.county || addr.state_district || 'Buxoro shahri';

        // Normalize city name
        let cleanCity = 'Buxoro shahri';
        const rawCityLower = (city || '').toLowerCase();
        if (rawCityLower.includes('kogon') || rawCityLower.includes('каган')) {
          cleanCity = 'Kogon shahri';
        } else if (rawCityLower.includes('g‘ijduvon') || rawCityLower.includes('gijduvon') || rawCityLower.includes('гиждуван')) {
          cleanCity = 'G‘ijduvon tumani';
        } else if (rawCityLower.includes('vobkent') || rawCityLower.includes('вабкент')) {
          cleanCity = 'Vobkent tumani';
        } else if (rawCityLower.includes('jondor') || rawCityLower.includes('жондор')) {
          cleanCity = 'Jondor tumani';
        } else if (rawCityLower.includes('qorako‘l') || rawCityLower.includes('qorakol') || rawCityLower.includes('каракуль')) {
          cleanCity = 'Qorako‘l tumani';
        } else {
          cleanCity = 'Buxoro shahri';
        }

        // Build clean human-readable address
        const parts = [];
        if (road) {
          parts.push(houseNumber ? `${road}, ${houseNumber}-uy` : road);
        } else if (neighborhood) {
          parts.push(neighborhood);
        } else if (data.name) {
          parts.push(data.name);
        }

        if (neighborhood && road && !parts[0].includes(neighborhood)) {
          parts.push(neighborhood);
        }

        let formattedAddress = parts.join(', ');
        if (!formattedAddress) {
          formattedAddress = `${cleanCity}, mo'ljal: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        }

        setDetectedAddress(formattedAddress);
        setDetectedCity(cleanCity);

        if (onAddressSelected) {
          onAddressSelected({
            address: formattedAddress,
            city: cleanCity,
            lat,
            lon,
            locationUrl: yandexUrl
          });
        }
      } else {
        throw new Error('Geocoding response not ok');
      }
    } catch (err) {
      console.warn('Reverse geocoding fallback to coords:', err);
      const fallbackAddress = `Buxoro shahri (${lat.toFixed(5)}, ${lon.toFixed(5)})`;
      setDetectedAddress(fallbackAddress);
      setDetectedCity('Buxoro shahri');

      if (onAddressSelected) {
        onAddressSelected({
          address: fallbackAddress,
          city: 'Buxoro shahri',
          lat,
          lon,
          locationUrl: yandexUrl
        });
      }
    } finally {
      setGeocoding(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    const [initLat, initLon] = coords;

    const map = L.map(mapContainerRef.current, {
      center: [initLat, initLon],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Add Tile Layer (OpenStreetMap Standard - 100% Free, No API Key Required)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Draggable Custom Marker
    const marker = L.marker([initLat, initLon], {
      icon: createPinIcon(),
      draggable: true,
      autoPan: true
    }).addTo(map);

    // Marker drag event
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      const newCoords = [position.lat, position.lng];
      setCoords(newCoords);
      reverseGeocode(position.lat, position.lng);
    });

    // Map click event
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCoords([lat, lng]);
      reverseGeocode(lat, lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Trigger invalidateSize after initial render
    setTimeout(() => {
      map.invalidateSize();
      setLoading(false);
    }, 150);

    // Initial reverse geocode
    reverseGeocode(initLat, initLon);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position if coords change externally
  const updateMapPosition = (newLat, newLon, zoomLevel = 16) => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    mapInstanceRef.current.setView([newLat, newLon], zoomLevel, { animate: true });
    markerRef.current.setLatLng([newLat, newLon]);
    setCoords([newLat, newLon]);
    reverseGeocode(newLat, newLon);
  };

  // User Geolocation (GPS)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Qurilmangizda geolokatsiya qo‘llab-quvvatlanmaydi");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        updateMapPosition(latitude, longitude, 17);
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocating(false);
        alert("Geolokatsiyani aniqlab bo‘lmadi. Iltimos, xaritadan o‘zingiz tanlang.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Search Address or Landmark
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    const query = searchQuery.trim();
    const fullQuery = query.toLowerCase().includes('buxoro') || query.toLowerCase().includes('бухара')
      ? query
      : `${query}, Buxoro, O'zbekiston`;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=1&countrycodes=uz`
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const resultLat = parseFloat(results[0].lat);
          const resultLon = parseFloat(results[0].lon);
          updateMapPosition(resultLat, resultLon, 16);
        } else {
          alert("Manzil topilmadi. Boshqacha nom yoki yaqin mo‘ljal bilan qidirib ko‘ring.");
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      alert("Qidiruvda xatolik yuz berdi");
    } finally {
      setSearching(false);
    }
  };

  const yandexDirectUrl = `https://yandex.uz/maps/?pt=${coords[1]},${coords[0]}&z=17&l=map`;

  return (
    <div className="space-y-3.5">
      {/* Top Search Bar & Locate Me Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('checkout.mapSearchPlaceholder', 'Ko‘cha, mo‘ljal yoki binoni qidirish...')}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-24 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <button
            type="submit"
            disabled={searching}
            className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
          >
            {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Qidirish'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locating}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
          title="GPS orqali joylashuvni aniqlash"
        >
          {locating ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-900 dark:text-white" />
          ) : (
            <Navigation className="w-4 h-4 text-slate-900 dark:text-white" />
          )}
          <span>{t('checkout.locateMe', 'Mening joylashuvim')}</span>
        </button>
      </div>

      {/* Interactive Map Canvas */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-inner z-0">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900 dark:text-white mb-2" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Interaktiv xarita yuklanmoqda...
            </span>
          </div>
        )}

        {/* Leaflet container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Hint Overlay on bottom of map */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex justify-center z-10">
          <div className="bg-slate-900/90 dark:bg-black/90 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-1.5 pointer-events-auto border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-white fill-white" />
            <span>{t('checkout.mapHint', 'Uyingiz yoki ofisingiz nuqtasini belgilang yoki qizil belgini suring')}</span>
          </div>
        </div>
      </div>

      {/* Detected Address Details Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/60 mt-0.5">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  {t('checkout.detectedAddress', 'Xaritadan aniqlangan manzil')}
                </span>
                {geocoding && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-900 dark:text-white font-semibold">
                    <Loader2 className="w-3 h-3 animate-spin" /> Aniqlanmoqda...
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-950 dark:text-white mt-0.5 break-words">
                {detectedAddress || 'Buxoro shahri (xaritada nuqta tanlang)'}
              </p>
              <div className="flex flex-wrap items-center gap-2.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Shahar: <strong className="text-slate-700 dark:text-slate-200">{detectedCity}</strong></span>
                <span>•</span>
                <span className="font-mono text-[10px] bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded">
                  GPS: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
                </span>
              </div>
            </div>
          </div>

          <a
            href={yandexDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Yandex Maps da ochish"
          >
            <span>Yandex Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Optional Apartment / Floor / Entrance input */}
        <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80">
          <label className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block mb-1">
            {t('checkout.apartmentFloor', 'Xonadon / Ofis / Qavat / Podyezd')} (ixtiyoriy)
          </label>
          <input
            type="text"
            value={apartmentDetail || ''}
            onChange={(e) => onApartmentChange && onApartmentChange(e.target.value)}
            placeholder="Masalan: 42-xonadon, 3-qavat, 2-podyezd"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[var(--color-primary-500)] transition-all"
          />
        </div>
      </div>
    </div>
  );
}
