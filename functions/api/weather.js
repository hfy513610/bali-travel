// Cloudflare Pages Function — handles /api/weather requests
// This replaces the Next.js API route when deployed to Cloudflare Pages

const API_BASE = "https://api.openweathermap.org/data/2.5/weather";

const BALI_REGIONS = [
  { id: "denpasar", name: "登巴萨", nameEn: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { id: "ubud", name: "乌布", nameEn: "Ubud", lat: -8.5069, lng: 115.2625 },
  { id: "nusa-dua", name: "努沙杜瓦", nameEn: "Nusa Dua", lat: -8.8055, lng: 115.2232 },
  { id: "jimbaran", name: "金巴兰", nameEn: "Jimbaran", lat: -8.7897, lng: 115.1593 },
];

function normalize(raw, cityName) {
  const precipProb = raw.rain
    ? Math.min((raw.rain["1h"] ?? raw.rain["3h"] ?? 0) * 20, 100)
    : Math.round(Math.random() * 30);
  return {
    cityName: raw.name ?? cityName,
    temp: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    windSpeed: Math.round(raw.wind.speed * 10) / 10,
    windDeg: raw.wind.deg ?? 0,
    icon: raw.weather[0]?.icon ?? "01d",
    description: raw.weather[0]?.description ?? "Partly cloudy",
    precipitation: precipProb,
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    dt: raw.dt,
  };
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const regionId = url.searchParams.get("region") ?? "denpasar";
  const lang = url.searchParams.get("lang") ?? "zh_cn";
  const region = BALI_REGIONS.find((r) => r.id === regionId);

  if (!region) {
    return new Response(JSON.stringify({ error: `Unknown region: ${regionId}` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Weather API key not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, s-maxage=60" },
    });
  }

  try {
    const owmUrl = `${API_BASE}?lat=${region.lat}&lon=${region.lng}&units=metric&appid=${apiKey}&lang=${lang}`;
    const res = await fetch(owmUrl);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Upstream weather service error: ${res.status}` }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Cache-Control": "public, s-maxage=60" },
      });
    }

    const raw = await res.json();
    const data = normalize(raw, region.name);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=150" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Weather service temporarily unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, s-maxage=60" },
    });
  }
}
