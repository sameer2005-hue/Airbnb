mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  projection: "globe",
  zoom: 10,
  center: listing.geometry.coordinates,
});

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();
map.on("style.load", () => {
  map.setFog({});
});

// Create a DOM element for the custom marker icon
const el = document.createElement("div");
el.className = "marker";

// Add the marker symbol (location pin icon)
el.innerHTML = "📍"; // You can also use an SVG or image here

// Style the marker icon
el.style.fontSize = "30px";
el.style.cursor = "pointer";

// Create the popup but don't add it yet
const popup = new mapboxgl.Popup({
  offset: 25,
  closeButton: false,
  closeOnClick: false,
}).setHTML(
  `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
);

// Add marker to the map
const marker = new mapboxgl.Marker(el)
  .setLngLat(listing.geometry.coordinates)
  .addTo(map);

// Show popup on hover
el.addEventListener("mouseenter", () => {
  popup.setLngLat(listing.geometry.coordinates).addTo(map);
});

// Hide popup when not hovering
el.addEventListener("mouseleave", () => {
  popup.remove();
});
