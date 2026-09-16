import { Coordinates, isValidCoordinates } from "@/constants/location";

export interface EquatorialCoordinates {
  ra: number;
  dec: number;
}

export interface HorizontalCoordinates {
  alt: number;
  az: number;
}

export function getLocalSiderealTime(lng: number, at: Date): number {
  if (!Number.isFinite(lng) || !Number.isFinite(at.getTime())) {
    throw new Error("Sidereal time requires a finite longitude and date");
  }
  const julianDate = at.getTime() / 86_400_000 + 2_440_587.5;
  const centuries = (julianDate - 2_451_545) / 36_525;
  const meanSiderealDegrees =
    280.46061837 +
    360.98564736629 * (julianDate - 2_451_545) +
    0.000387933 * centuries * centuries;
  return (((meanSiderealDegrees + lng) % 360) + 360) % 360;
}

export function equatorialToHorizontal(
  equatorial: EquatorialCoordinates,
  location: Coordinates,
  at: Date,
): HorizontalCoordinates {
  if (
    !isValidCoordinates(location) ||
    !Number.isFinite(equatorial.ra) ||
    !Number.isFinite(equatorial.dec) ||
    equatorial.dec < -90 ||
    equatorial.dec > 90 ||
    !Number.isFinite(at.getTime())
  ) {
    throw new Error("Altitude/azimuth requires valid coordinates and date");
  }

  const lst = getLocalSiderealTime(location.lng, at);
  const hourAngle = (((lst - equatorial.ra) % 360) + 360) % 360;
  const hourAngleRad = (hourAngle * Math.PI) / 180;
  const declinationRad = (equatorial.dec * Math.PI) / 180;
  const latitudeRad = (location.lat * Math.PI) / 180;
  const sinAltitude =
    Math.sin(declinationRad) * Math.sin(latitudeRad) +
    Math.cos(declinationRad) * Math.cos(latitudeRad) * Math.cos(hourAngleRad);
  const altitudeRad = Math.asin(Math.max(-1, Math.min(1, sinAltitude)));
  const altitude = (altitudeRad * 180) / Math.PI;
  const cosAltitude = Math.cos(altitudeRad);
  const cosAzimuth =
    cosAltitude > 0.0001
      ? (Math.sin(declinationRad) - Math.sin(latitudeRad) * sinAltitude) /
        (Math.cos(latitudeRad) * cosAltitude)
      : 0;
  let azimuth =
    (Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * 180) / Math.PI;
  if (Math.sin(hourAngleRad) > 0) azimuth = 360 - azimuth;
  return { alt: altitude, az: azimuth };
}

export function getMoonPosition(at: Date): EquatorialCoordinates {
  const days = at.getTime() / 86_400_000 + 2_440_587.5 - 2_451_545;
  const longitude = (((218.316 + 13.176396 * days) % 360) + 360) % 360;
  const anomaly = (((134.963 + 13.064993 * days) % 360) + 360) % 360;
  const argument = (((93.272 + 13.22935 * days) % 360) + 360) % 360;
  const eclipticLongitude =
    longitude + 6.289 * Math.sin((anomaly * Math.PI) / 180);
  const eclipticLatitude = 5.128 * Math.sin((argument * Math.PI) / 180);
  const obliquity = (23.439 * Math.PI) / 180;
  const longitudeRad = (eclipticLongitude * Math.PI) / 180;
  const latitudeRad = (eclipticLatitude * Math.PI) / 180;
  const ra =
    (Math.atan2(
      Math.sin(longitudeRad) * Math.cos(obliquity) -
        Math.tan(latitudeRad) * Math.sin(obliquity),
      Math.cos(longitudeRad),
    ) *
      180) /
    Math.PI;
  const dec =
    (Math.asin(
      Math.sin(latitudeRad) * Math.cos(obliquity) +
        Math.cos(latitudeRad) * Math.sin(obliquity) * Math.sin(longitudeRad),
    ) *
      180) /
    Math.PI;
  return { ra: ((ra % 360) + 360) % 360, dec };
}

const REFERENCE_NEW_MOON_MS = Date.parse("2024-01-11T11:57:00Z");
const SYNODIC_MONTH_MS = 29.53059 * 86_400_000;

export function getMoonPhaseFraction(at: Date): number {
  return (
    ((((at.getTime() - REFERENCE_NEW_MOON_MS) % SYNODIC_MONTH_MS) +
      SYNODIC_MONTH_MS) %
      SYNODIC_MONTH_MS) /
    SYNODIC_MONTH_MS
  );
}

export function getMoonIllumination(at: Date): number {
  return 0.5 * (1 - Math.cos(2 * Math.PI * getMoonPhaseFraction(at)));
}
