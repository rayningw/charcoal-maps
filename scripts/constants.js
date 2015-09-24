// https://snazzymaps.com/style/15/subtle-grayscale
var MAP_STYLES = [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 65
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 30
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 40
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffff00"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -97
            }
        ]
    }
];

var HEATMAP_GRADIENT = [
  'rgba(255, 255, 255, 0)',
  '#935e66',
  '#9f4a49',
  '#dc4733',
  '#fe6204',
  '#fc6e00',
  '#fd9800',
  '#ffd40e',
  '#fdfea4',
  '#fefef5',
];

// Radius when the map is at the base zoom level
var BASE_RADIUS = 30;

var BASE_ZOOM = 15;

// How sticky the adjusted radius stays near the base radius
var RADIUS_STICKINESS = 2;
  
var PLACE_TYPES = {
  accounting: {
    label: 'Accounting',
    gMapsPlaceType: 'accounting'
  },
  airport: {
    label: 'Airport',
    gMapsPlaceType: 'airport'
  },
  amusementPark: {
    label: 'Amusement park',
    gMapsPlaceType: 'amusement_park'
  },
  aquarium: {
    label: 'Aquarium',
    gMapsPlaceType: 'aquarium'
  },
  artGallery: {
    label: 'Art gallery',
    gMapsPlaceType: 'art_gallery'
  },
  atm: {
    label: 'Atm',
    gMapsPlaceType: 'atm'
  },
  bakery: {
    label: 'Bakery',
    gMapsPlaceType: 'bakery'
  },
  bank: {
    label: 'Bank',
    gMapsPlaceType: 'bank'
  },
  bar: {
    label: 'Bar',
    gMapsPlaceType: 'bar'
  },
  beautySalon: {
    label: 'Beauty salon',
    gMapsPlaceType: 'beauty_salon'
  },
  bicycleStore: {
    label: 'Bicycle store',
    gMapsPlaceType: 'bicycle_store'
  },
  bookStore: {
    label: 'Book store',
    gMapsPlaceType: 'book_store'
  },
  bowlingAlley: {
    label: 'Bowling alley',
    gMapsPlaceType: 'bowling_alley'
  },
  busStation: {
    label: 'Bus station',
    gMapsPlaceType: 'bus_station'
  },
  cafe: {
    label: 'Cafe',
    gMapsPlaceType: 'cafe'
  },
  campground: {
    label: 'Campground',
    gMapsPlaceType: 'campground'
  },
  carDealer: {
    label: 'Car dealer',
    gMapsPlaceType: 'car_dealer'
  },
  carRental: {
    label: 'Car rental',
    gMapsPlaceType: 'car_rental'
  },
  carRepair: {
    label: 'Car repair',
    gMapsPlaceType: 'car_repair'
  },
  carWash: {
    label: 'Car wash',
    gMapsPlaceType: 'car_wash'
  },
  casino: {
    label: 'Casino',
    gMapsPlaceType: 'casino'
  },
  cemetery: {
    label: 'Cemetery',
    gMapsPlaceType: 'cemetery'
  },
  church: {
    label: 'Church',
    gMapsPlaceType: 'church'
  },
  cityHall: {
    label: 'City hall',
    gMapsPlaceType: 'city_hall'
  },
  clothingStore: {
    label: 'Clothing store',
    gMapsPlaceType: 'clothing_store'
  },
  convenienceStore: {
    label: 'Convenience store',
    gMapsPlaceType: 'convenience_store'
  },
  courthouse: {
    label: 'Courthouse',
    gMapsPlaceType: 'courthouse'
  },
  dentist: {
    label: 'Dentist',
    gMapsPlaceType: 'dentist'
  },
  departmentStore: {
    label: 'Department store',
    gMapsPlaceType: 'department_store'
  },
  doctor: {
    label: 'Doctor',
    gMapsPlaceType: 'doctor'
  },
  electrician: {
    label: 'Electrician',
    gMapsPlaceType: 'electrician'
  },
  electronicsStore: {
    label: 'Electronics store',
    gMapsPlaceType: 'electronics_store'
  },
  embassy: {
    label: 'Embassy',
    gMapsPlaceType: 'embassy'
  },
  establishment: {
    label: 'Establishment',
    gMapsPlaceType: 'establishment'
  },
  finance: {
    label: 'Finance',
    gMapsPlaceType: 'finance'
  },
  fireStation: {
    label: 'Fire station',
    gMapsPlaceType: 'fire_station'
  },
  florist: {
    label: 'Florist',
    gMapsPlaceType: 'florist'
  },
  food: {
    label: 'Food',
    gMapsPlaceType: 'food'
  },
  funeralHome: {
    label: 'Funeral home',
    gMapsPlaceType: 'funeral_home'
  },
  furnitureStore: {
    label: 'Furniture store',
    gMapsPlaceType: 'furniture_store'
  },
  gasStation: {
    label: 'Gas station',
    gMapsPlaceType: 'gas_station'
  },
  generalContractor: {
    label: 'General contractor',
    gMapsPlaceType: 'general_contractor'
  },
  groceryOrSupermarket: {
    label: 'Grocery or supermarket',
    gMapsPlaceType: 'grocery_or_supermarket'
  },
  gym: {
    label: 'Gym',
    gMapsPlaceType: 'gym'
  },
  hairCare: {
    label: 'Hair care',
    gMapsPlaceType: 'hair_care'
  },
  hardwareStore: {
    label: 'Hardware store',
    gMapsPlaceType: 'hardware_store'
  },
  health: {
    label: 'Health',
    gMapsPlaceType: 'health'
  },
  hinduTemple: {
    label: 'Hindu temple',
    gMapsPlaceType: 'hindu_temple'
  },
  homeGoodsStore: {
    label: 'Home goods store',
    gMapsPlaceType: 'home_goods_store'
  },
  hospital: {
    label: 'Hospital',
    gMapsPlaceType: 'hospital'
  },
  insuranceAgency: {
    label: 'Insurance agency',
    gMapsPlaceType: 'insurance_agency'
  },
  jewelryStore: {
    label: 'Jewelry store',
    gMapsPlaceType: 'jewelry_store'
  },
  laundry: {
    label: 'Laundry',
    gMapsPlaceType: 'laundry'
  },
  lawyer: {
    label: 'Lawyer',
    gMapsPlaceType: 'lawyer'
  },
  library: {
    label: 'Library',
    gMapsPlaceType: 'library'
  },
  liquorStore: {
    label: 'Liquor store',
    gMapsPlaceType: 'liquor_store'
  },
  localGovernmentOffice: {
    label: 'Local government office',
    gMapsPlaceType: 'local_government_office'
  },
  locksmith: {
    label: 'Locksmith',
    gMapsPlaceType: 'locksmith'
  },
  lodging: {
    label: 'Lodging',
    gMapsPlaceType: 'lodging'
  },
  mealDelivery: {
    label: 'Meal delivery',
    gMapsPlaceType: 'meal_delivery'
  },
  mealTakeaway: {
    label: 'Meal takeaway',
    gMapsPlaceType: 'meal_takeaway'
  },
  mosque: {
    label: 'Mosque',
    gMapsPlaceType: 'mosque'
  },
  movieRental: {
    label: 'Movie rental',
    gMapsPlaceType: 'movie_rental'
  },
  movieTheater: {
    label: 'Movie theater',
    gMapsPlaceType: 'movie_theater'
  },
  movingCompany: {
    label: 'Moving company',
    gMapsPlaceType: 'moving_company'
  },
  museum: {
    label: 'Museum',
    gMapsPlaceType: 'museum'
  },
  nightClub: {
    label: 'Night club',
    gMapsPlaceType: 'night_club'
  },
  painter: {
    label: 'Painter',
    gMapsPlaceType: 'painter'
  },
  park: {
    label: 'Park',
    gMapsPlaceType: 'park'
  },
  parking: {
    label: 'Parking',
    gMapsPlaceType: 'parking'
  },
  petStore: {
    label: 'Pet store',
    gMapsPlaceType: 'pet_store'
  },
  pharmacy: {
    label: 'Pharmacy',
    gMapsPlaceType: 'pharmacy'
  },
  physiotherapist: {
    label: 'Physiotherapist',
    gMapsPlaceType: 'physiotherapist'
  },
  placeOfWorship: {
    label: 'Place of worship',
    gMapsPlaceType: 'place_of_worship'
  },
  plumber: {
    label: 'Plumber',
    gMapsPlaceType: 'plumber'
  },
  police: {
    label: 'Police',
    gMapsPlaceType: 'police'
  },
  postOffice: {
    label: 'Post office',
    gMapsPlaceType: 'post_office'
  },
  realEstateAgency: {
    label: 'Real estate agency',
    gMapsPlaceType: 'real_estate_agency'
  },
  restaurant: {
    label: 'Restaurant',
    gMapsPlaceType: 'restaurant'
  },
  roofingContractor: {
    label: 'Roofing contractor',
    gMapsPlaceType: 'roofing_contractor'
  },
  rvPark: {
    label: 'Rv park',
    gMapsPlaceType: 'rv_park'
  },
  school: {
    label: 'School',
    gMapsPlaceType: 'school'
  },
  shoeStore: {
    label: 'Shoe store',
    gMapsPlaceType: 'shoe_store'
  },
  shoppingMall: {
    label: 'Shopping mall',
    gMapsPlaceType: 'shopping_mall'
  },
  spa: {
    label: 'Spa',
    gMapsPlaceType: 'spa'
  },
  stadium: {
    label: 'Stadium',
    gMapsPlaceType: 'stadium'
  },
  storage: {
    label: 'Storage',
    gMapsPlaceType: 'storage'
  },
  store: {
    label: 'Store',
    gMapsPlaceType: 'store'
  },
  subwayStation: {
    label: 'Subway station',
    gMapsPlaceType: 'subway_station'
  },
  synagogue: {
    label: 'Synagogue',
    gMapsPlaceType: 'synagogue'
  },
  taxiStand: {
    label: 'Taxi stand',
    gMapsPlaceType: 'taxi_stand'
  },
  trainStation: {
    label: 'Train station',
    gMapsPlaceType: 'train_station'
  },
  travelAgency: {
    label: 'Travel agency',
    gMapsPlaceType: 'travel_agency'
  },
  university: {
    label: 'University',
    gMapsPlaceType: 'university'
  },
  veterinaryCare: {
    label: 'Veterinary care',
    gMapsPlaceType: 'veterinary_care'
  },
  zoo: {
    label: 'Zoo',
    gMapsPlaceType: 'zoo'
  }
};

var DEFAULT_PRESETS = {
  rockridge: {
    label: 'Rockridge',
    latitude: 37.8446,
    longitude: -122.2512
  },
  pyrmont: {
    label: 'Pyrmont',
    latitude: -33.8665433,
    longitude: 151.1956316
  },
  sanFrancisco: {
    label: 'San Francisco',
    latitude: 37.774546,
    longitude: -122.433523
  },
  stockholm: {
    label: 'Stockholm',
    latitude: 59.335423,
    longitude: 18.069600
  },
  manhattan: {
    label: 'Manhattan',
    latitude: 40.790651,
    longitude: -73.954983
  },
  wentworthville: {
    label: 'Wentworthville',
    latitude: -33.807066,
    longitude: 150.972452
  },
  charlesVillage: {
    label: 'Charles Village',
    latitude: 39.320059,
    longitude: -76.616324
  }
};

// http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to
var GMAPS_ZOOM_SCALES = {
  20 : 1128.497220,
  19 : 2256.994440,
  18 : 4513.988880,
  17 : 9027.977761,
  16 : 18055.955520,
  15 : 36111.911040,
  14 : 72223.822090,
  13 : 144447.644200,
  12 : 288895.288400,
  11 : 577790.576700,
  10 : 1155581.153000,
  9  : 2311162.307000,
  8  : 4622324.614000,
  7  : 9244649.227000,
  6  : 18489298.450000,
  5  : 36978596.910000,
  4  : 73957193.820000,
  3  : 147914387.600000,
  2  : 295828775.300000,
  1  : 591657550.500000
};

exports.MAP_STYLES = MAP_STYLES;
exports.HEATMAP_GRADIENT = HEATMAP_GRADIENT;
exports.BASE_RADIUS = BASE_RADIUS;
exports.BASE_ZOOM = BASE_ZOOM;
exports.RADIUS_STICKINESS = RADIUS_STICKINESS;
exports.PLACE_TYPES = PLACE_TYPES;
exports.DEFAULT_PRESETS = DEFAULT_PRESETS;
exports.GMAPS_ZOOM_SCALES = GMAPS_ZOOM_SCALES;
