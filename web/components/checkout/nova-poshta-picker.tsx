'use client';

import { useState, useEffect, useRef } from 'react';
import { searchNPCities, getNPWarehouses, type NPCity, type NPWarehouse } from '@/lib/nova-poshta';
import { useDebounce } from '@/lib/use-debounce';
import { MapPin, Box, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';

interface Props {
  onCitySelect: (city: string) => void;
  onWarehouseSelect: (warehouse: string) => void;
}

export function NovaPoshtaPicker({ onCitySelect, onWarehouseSelect }: Props) {
  const { t } = useI18n();
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<NPCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NPCity | null>(null);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [warehouses, setWarehouses] = useState<NPWarehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<NPWarehouse | null>(null);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [isWarehouseDropdownOpen, setIsWarehouseDropdownOpen] = useState(false);
  const [warehouseQuery, setWarehouseQuery] = useState('');

  const debouncedCityQuery = useDebounce(cityQuery, 400);
  const cityRef = useRef<HTMLDivElement>(null);
  const warehouseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setIsCityDropdownOpen(false);
      if (warehouseRef.current && !warehouseRef.current.contains(e.target as Node)) setIsWarehouseDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedCityQuery || selectedCity?.Description === debouncedCityQuery) return;
    let isMounted = true;
    setIsSearchingCity(true);
    
    searchNPCities(debouncedCityQuery).then((res) => {
      if (isMounted) {
        setCities(res);
        setIsSearchingCity(false);
        setIsCityDropdownOpen(true);
      }
    });
    return () => { isMounted = false; };
  }, [debouncedCityQuery, selectedCity]);

  useEffect(() => {
    if (!selectedCity) {
      setWarehouses([]);
      return;
    }
    let isMounted = true;
    setIsLoadingWarehouses(true);

    getNPWarehouses(selectedCity.Ref).then((res) => {
      if (isMounted) {
        setWarehouses(res);
        setIsLoadingWarehouses(false);
      }
    });
    return () => { isMounted = false; };
  }, [selectedCity]);

  const handleCitySelect = (city: NPCity) => {
    setSelectedCity(city);
    setCityQuery(city.Description);
    onCitySelect(`${city.Description}, ${city.AreaDescription}`);
    setIsCityDropdownOpen(false);
    setSelectedWarehouse(null);
    setWarehouseQuery('');
    onWarehouseSelect('');
  };

  const handleWarehouseSelect = (warehouse: NPWarehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseQuery(warehouse.Description);
    onWarehouseSelect(warehouse.Description);
    setIsWarehouseDropdownOpen(false);
  };

  const filteredWarehouses = warehouses.filter(w => 
    w.Description.toLowerCase().includes(warehouseQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="space-y-1.5 relative" ref={cityRef}>
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
          <MapPin size={14} /> {t('checkout.city' as any)}
        </label>
        <div className="relative">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              if (selectedCity) setSelectedCity(null);
            }}
            onFocus={() => { if (cities.length > 0) setIsCityDropdownOpen(true); }}
            placeholder={t('checkout.city' as any)}
            className="w-full h-14 pl-5 pr-12 rounded-2xl bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold outline-none transition-all text-[var(--foreground)]"
          />
          {isSearchingCity && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-blue-500" />}
        </div>
        
        {isCityDropdownOpen && cities.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
            {cities.map((city) => (
              <button
                key={city.Ref}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-5 py-3 hover:bg-[var(--background)] transition-colors border-b border-[var(--border)] last:border-b-0 flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-[var(--foreground)]">{city.Description}</div>
                  <div className="text-xs text-slate-500 font-medium">{city.AreaDescription}</div>
                </div>
                {selectedCity?.Ref === city.Ref && <Check className="text-blue-500 h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={cn("space-y-1.5 relative transition-opacity duration-300", !selectedCity ? "opacity-50 pointer-events-none" : "opacity-100")} ref={warehouseRef}>
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
          <Box size={14} /> {t('checkout.branch' as any)}
        </label>
        <div className="relative">
          <input
            type="text"
            value={warehouseQuery}
            onChange={(e) => {
              setWarehouseQuery(e.target.value);
              setIsWarehouseDropdownOpen(true);
            }}
            onFocus={() => setIsWarehouseDropdownOpen(true)}
            placeholder={isLoadingWarehouses ? t('common.loading' as any) : t('checkout.branch' as any)}
            disabled={!selectedCity || isLoadingWarehouses}
            className="w-full h-14 pl-5 pr-12 rounded-2xl bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold outline-none transition-all text-[var(--foreground)] disabled:opacity-70"
          />
          {isLoadingWarehouses && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-blue-500" />}
        </div>

        {isWarehouseDropdownOpen && filteredWarehouses.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
            {filteredWarehouses.map((warehouse) => (
              <button
                key={warehouse.Ref}
                type="button"
                onClick={() => handleWarehouseSelect(warehouse)}
                className="w-full text-left px-5 py-3 hover:bg-[var(--background)] transition-colors border-b border-[var(--border)] last:border-b-0 flex items-center justify-between group"
              >
                <div className="font-bold text-[var(--foreground)] text-sm">{warehouse.Description}</div>
                {selectedWarehouse?.Ref === warehouse.Ref && <Check className="text-blue-500 h-4 w-4 shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}