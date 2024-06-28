import './ol-map.css';
import {Map, Overlay, View} from 'ol';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Icon, Style} from 'ol/style.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer, Image as ImageLayer } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj.js';
import { toLonLat } from 'ol/proj.js';
import { toStringHDMS } from 'ol/coordinate.js';

// Settings
const zoom = 16;
const point = [21.00192, 52.22774]; // LonLat
const lonlat = fromLonLat(point)

// Marker
const icon = new Feature({  
  geometry: new Point(lonlat),
  name: 'Warsaw',
  population: 1760000,
});

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'data/icon.png',
  }),
});

icon.setStyle(iconStyle);

const vectorSource = new VectorSource({
  features: [icon],
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
      '<div><strong>Location:</strong> ' + toStringHDMS(toLonLat(coord)) + '</div>' +
      '<div><strong>Place:</strong> ' + feature.get('name') + '</div>' +
      '<div><strong>Population:</strong> ' + feature.get('population') + '</div>'    
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