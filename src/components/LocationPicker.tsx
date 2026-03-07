import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Search, Home, Briefcase, Map as MapIcon } from "lucide-react";

// Fix for default marker icon in Leaflet with React
const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 15);
    }, [center, map]);
    return null;
}

interface LocationDetails {
    address: string;
    type: string;
    pincode: string;
    district: string;
    state: string;
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    onLocationSelect: (details: LocationDetails) => void;
    onCancel: () => void;
}

export default function LocationPicker({ onLocationSelect, onCancel }: LocationPickerProps) {
    const [position, setPosition] = useState<[number, number]>([20.5937, 78.9629]);
    const [search, setSearch] = useState("");
    const [details, setDetails] = useState<LocationDetails>({
        address: "",
        type: "home",
        pincode: "",
        district: "",
        state: "",
        lat: 20.5937,
        lng: 78.9629
    });
    const [isLocating, setIsLocating] = useState(false);

    const getLiveLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setPosition([lat, lon]);
                reverseGeocode(lat, lon);
                setIsLocating(false);
            },
            (error) => {
                console.error(error);
                setIsLocating(false);
            }
        );
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            if (data) {
                setDetails(prev => ({
                    ...prev,
                    address: data.display_name,
                    pincode: data.address.postcode || "",
                    district: data.address.city || data.address.town || data.address.district || "",
                    state: data.address.state || "",
                    lat,
                    lng: lon
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const searchLocation = async () => {
        if (!search) return;
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${search}&addressdetails=1`);
            const data = await res.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                setPosition([lat, lon]);
                setDetails({
                    address: data[0].display_name,
                    type: details.type,
                    pincode: data[0].address.postcode || "",
                    district: data[0].address.city || data[0].address.town || data[0].address.district || "",
                    state: data[0].address.state || "",
                    lat,
                    lng: lon
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search building, area or street..."
                            className="pl-10"
                            onKeyDown={(e) => e.key === 'Enter' && searchLocation()}
                        />
                    </div>
                    <Button onClick={searchLocation} variant="secondary">Search</Button>
                </div>

                <Button
                    onClick={getLiveLocation}
                    disabled={isLocating}
                    className="w-full gold-gradient text-primary-foreground font-bold"
                >
                    <Navigation className={`w-4 h-4 mr-2 ${isLocating ? 'animate-pulse' : ''}`} />
                    {isLocating ? 'Detecting Location...' : 'Use My Live Location'}
                </Button>
            </div>

            <div className="rounded-xl overflow-hidden border border-border h-[300px] relative z-0">
                <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <ChangeView center={position} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} icon={icon}>
                        <Popup>{details.address || "Selected Location"}</Popup>
                    </Marker>
                </MapContainer>
            </div>

            <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border">
                <h3 className="font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Confirm Address Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Label>Selected Address</Label>
                        <Input
                            value={details.address}
                            onChange={(e) => setDetails({ ...details, address: e.target.value })}
                            placeholder="Full Address"
                        />
                    </div>

                    <div>
                        <Label>Location Type</Label>
                        <div className="flex gap-2 mt-1">
                            <Button
                                type="button"
                                variant={details.type === 'home' ? 'default' : 'outline'}
                                className="flex-1 text-xs"
                                onClick={() => setDetails({ ...details, type: 'home' })}
                            >
                                <Home className="w-3 h-3 mr-1" /> Home
                            </Button>
                            <Button
                                type="button"
                                variant={details.type === 'work' ? 'default' : 'outline'}
                                className="flex-1 text-xs"
                                onClick={() => setDetails({ ...details, type: 'work' })}
                            >
                                <Briefcase className="w-3 h-3 mr-1" /> Work
                            </Button>
                            <Button
                                type="button"
                                variant={details.type === 'other' ? 'default' : 'outline'}
                                className="flex-1 text-xs"
                                onClick={() => setDetails({ ...details, type: 'other' })}
                            >
                                <MapIcon className="w-3 h-3 mr-1" /> Other
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label>Pin Code</Label>
                        <Input
                            value={details.pincode}
                            onChange={(e) => setDetails({ ...details, pincode: e.target.value })}
                            placeholder="6-digit PIN"
                        />
                    </div>

                    <div>
                        <Label>District</Label>
                        <Input
                            value={details.district}
                            onChange={(e) => setDetails({ ...details, district: e.target.value })}
                            placeholder="District"
                        />
                    </div>

                    <div>
                        <Label>State</Label>
                        <Input
                            value={details.state}
                            onChange={(e) => setDetails({ ...details, state: e.target.value })}
                            placeholder="State"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
                <Button
                    className="flex-1 gold-gradient text-primary-foreground font-bold"
                    onClick={() => onLocationSelect(details)}
                    disabled={!details.address || !details.pincode}
                >
                    Confirm & Order
                </Button>
            </div>
        </div>
    );
}
