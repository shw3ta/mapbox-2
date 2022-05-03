mapboxgl.accessToken = 'pk.eyJ1IjoidHVuZHJhdGhlcmFpbXkiLCJhIjoiY2wxdzV6czg2MW02azNpcXNjOXQxYjh5cSJ9.B-hTJxiaSAX1AlG6_a7F2g';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/tundratheraimy/cl2omakm2000f15qmv4jhdcz3',
center: [77.0688997, 28.5272803],
zoom: 3,
bearing: 0,
pitch: 0
});
//This is all the stuff that runs on the first load of the map.
map.on('load', () => {
  //Hide all presentation layers
  //This demo uses three specific layers. I want to hide them initially so I can reveal them piece meal.
  map.setLayoutProperty('temporality-count', 'visibility', 'none');
  map.setLayoutProperty('gendered-lines', 'visibility', 'none');
  

  //Hide the legend, slider, and infobox on first load. Obviously delete these lines if you want them visible from the start.
  document.getElementById('legend').style.display = 'none';
  document.getElementById('console').style.display = 'none';

  //to reduce clutter, the steps for creating a legend, slider, and menu have all been turned into functions.
  createLegend()
  createSlider()
  createMenu()

});

//This is a lazy function to hide and show menus relative to the layers. It waits for any change in the map rendering and then checks to see what menu items are active and turns on the infobox, slider, and legend. Normally, you would build this logic into the click event handler for each button.

map.on('idle', () => {

  var toggleableLayerIds = ['gendered-lines',  'temporality-count'];

  for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];
    var visibility = map.getLayoutProperty(id, 'visibility');

    if (id == 'gendered-lines' && visibility === 'none') {
      document.getElementById('legend').style.display = 'none';
    } else if (id == 'gendered-lines' && visibility === 'visible') {
      document.getElementById('legend').style.display = 'initial';
    }
    if (id == 'temporality-count' && visibility === 'none') {
      document.getElementById('console').style.display = 'none';
    } else if (id == 'temporality-count' && visibility === 'visible') {
      document.getElementById('console').style.display = 'initial';
    }
   
  }
});

function createMenu(){

    // MENU For selecting layers
    // Read in all the layers you want to toggle
    var toggleableLayerIds = ['gendered-lines', 'temporality-count'];

    //These are the names for the layers that will appear on the menu
    var layerNames = ['Legend: Gender', 'Slider: Temporality']

    //Loop that generates a menu item for each layer in the above array.
    for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];
      var name = layerNames[i];
      var link = document.createElement('a');
      link.href = '#';
      link.className = ''; //Menu initially sets every item as inactive.
      link.textContent = name;
      link.id = id;

      //create an event handler for each menu item. If clicked check whether the layer is visible, if so set visibility to 'none' and vice versa.
      link.onclick = function(e) 
      {
        var clickedLayer = this.id;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
          map.setLayoutProperty(clickedLayer, 'visibility', 'none');
          this.className = '';

        } else {
          this.className = 'active';
          map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
      };
      var layers = document.getElementById('menu');
      layers.appendChild(link);
    }

}


function createLegend() {
  //LEGEND TEXT
  //the var layers array sets the text that will show up in the legend. you can enter any value here it is just text. Make sure that the legend values correspond to the ones you set in Mapbox.
  var layers = ['Female', 'Male'];

  //LEGEND COLORS
  //Set the corresponding LEGEND colors using HEX the easiest way to do this is by setting your mapcolors in Mapbox using ColorBrewer (colorbrewer2.org). Then copy the exact same hex value to the array below. Remember that each label above should correspond to a color. If the number of items in layers does not match the number of values in colors you will get an error.
  var colors = ['#34c53c', '#2b1ba1'];

//run through each element in the legend array and create a new legend item.
  for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }
  //LEGEND CODE


}

function createSlider() {
  //Set the initial view at the first value. In this case, 1 for Pre-Partition.
  map.setFilter('temporality-count', ['==', ['number', ['get', 'temporal_sequence']], 1]);
  document.getElementById('active-temporality').innerText = 'Pre-Partition (before 1947-08-14)'
  map.setLayoutProperty('temporality-count', 'visibility', 'none')

  //Create event listener to catch whenever the slider is moved.
  document.getElementById('slider').addEventListener('input', function(e) {
    //get the value of the movement.
    var step = parseInt(e.target.value, 10);

    //These labels were created to populate the active temporality label. Change them if you are going with your own string sequence.
    var label = ['Pre-Partition (before 1947-08-14)',
      'Partition (1947-08-15 - 1948-02-28)',
      'Post-Partition (1948-03-01 - 1971-12-16)',
      'Long Partition (after 1971-12-16)',
      'Indeterminable'
    ]

    //This is the filter function, it relies on the layer name, the comparison operator (==), the first value which it grabs with the get, temporal sequence function, and then the thing being compared against (step), or the step in the sequence of the slider.

    map.setFilter('temporality-count', ['==', ['number', ['get', 'temporal_sequence']], step]);
    //This sets the label above the slider to the period value.
    document.getElementById('active-temporality').innerText = label[step - 1] //+ ampm;
  })
}

const chapters = {
'part_1': {
bearing:0,
center: [77.0688997, 28.5272803],
zoom: 3,
pitch: 0
},
'part_2': {
duration: 7000,
center: [74.3141829, 31.5656822],
bearing: 0,
zoom: 10,
pitch: 0
},
'part_3': {
bearing: 45,
center: [74.3383, 31.5767],
zoom: 13,
speed: 1,
pitch: 50
},
'part_4': {
bearing: 45,
center: [74.8736788, 31.6343083],
zoom: 14,
pitch: 65,
speed: .5
},
'part_5': {
bearing: 180,
center: [77.1835, 28.6239],
zoom: 11,
pitch: 10,
speed: 1,
curve:1
},
'part_6': {
bearing: 25,
center: [77.0688997, 28.5272803],
zoom: 7
}
};

let activeChapterName = 'part_1';
function setActiveChapter(chapterName) {
if (chapterName === activeChapterName) return;

map.flyTo(chapters[chapterName]);

document.getElementById(chapterName).classList.add('active');
document.getElementById(activeChapterName).classList.remove('active');

activeChapterName = chapterName;
}

function isElementOnScreen(id) {
const element = document.getElementById(id);
const bounds = element.getBoundingClientRect();
return bounds.top < window.innerHeight && bounds.bottom > 0;
}

// On every scroll event, check which element is on screen
window.onscroll = () => {
for (const chapterName in chapters) {
if (isElementOnScreen(chapterName)) {
setActiveChapter(chapterName);
break;
}
}
};
