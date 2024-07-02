import './ol-map.css';
import {Map, Overlay, View} from 'ol';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Icon, Style} from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer.js';
import { toLonLat, fromLonLat } from 'ol/proj.js';
import { toStringHDMS } from 'ol/coordinate.js';

// Settings
const zoom = 15;
const point = [21.00192, 52.22774]; // Center map
const lonlat = fromLonLat(point)
const features = []

// Add markers
const locations = [
  {
    name: 'Drink Bar',
    street: 'Złota 44',
    city: '01-100 Warsaw',
    image: 'https://images.pexels.com/photos/11468998/pexels-photo-11468998.jpeg',
    point: [21.00192, 52.22774]
  },
  {
    name: 'Pool Bar',
    street: 'Piękna 14',
    city: '02-100 Warsaw',
    image: 'https://images.pexels.com/photos/261043/pexels-photo-261043.jpeg',
    point: [20.99000, 52.23074]
  }
]

// Icon style
const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'data/icon.png',
  }),
});

// Markers
locations.forEach((i) => {
  // Create marker
  const icon = new Feature({  
    geometry: new Point(fromLonLat(i.point)),
    name: i.name,
    city: i.city,
    street: i.street,
    image: i.image
  })
  // Add style
  icon.setStyle(iconStyle)
  // Add to array
  features.push(icon)
})

const vectorSource = new VectorSource({  
  features: features,
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

// Popup
const container = document.getElementById('olpopup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

// Marker Layer
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

// Map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer    
  ],
  view: new View({    
    center: lonlat,
    zoom: zoom
  }),
  overlays: [overlay],
});

// Events
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  const hdms = toStringHDMS(toLonLat(coordinate));
  console.log('Open popup event', coordinate, hdms);

  const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    const coord = feature.getGeometry().getCoordinates();
    content.innerHTML =
    '<div><img src="' + feature.get('image') + '"/></div>' +
    '<h2>' + feature.get('name') + '</h2>' +
    '<div><strong>City:</strong> ' + feature.get('city') + '</div>' +    
    '<div><strong>Address:</strong> ' + feature.get('street') + '</div>' +
    '<div><strong>Location:</strong> ' + toStringHDMS(toLonLat(coord)) + '</div>'
    overlay.setPosition(coord);    
  } else {
    overlay.setPosition(undefined);
  }
});

// Samples
// const view = map.getView();
// view.animate({ zoom: 5 }, { center: fromLonLat([5, 9]) });
// let coordinates = icon.getGeometry().getCoordinates()
// console.log('Marker', coordinates, icon.get('name'));
// iconFeature.getGeometry().setCoordinates(lonlat)
// coordinates = iconFeature.getGeometry().getCoordinates()
// console.log('Marker', coordinates, icon.get('name'));
// view.centerOn([52,21],[0,0],[0,0])
// view.setZoom(5)
// view.setCenter(point)
// view.adjustCenter(point)
// view.centerOn(iconFeature.getGeometry().getCoordinates(), map.getSize(), point)
// map.getView().setCenter([3,5])