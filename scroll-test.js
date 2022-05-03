mapboxgl.accessToken = 'pk.eyJ1IjoidHVuZHJhdGhlcmFpbXkiLCJhIjoiY2wxdzV6czg2MW02azNpcXNjOXQxYjh5cSJ9.B-hTJxiaSAX1AlG6_a7F2g';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/tundratheraimy/cl2omakm2000f15qmv4jhdcz3',
center: [77.0688997, 28.5272803],
zoom: 3,
bearing: 0,
pitch: 0
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

map.on('load', () => 
{
  // I want to show the slider, legend from the start
  map.setLayoutProperty('gendered-lines-female','visibility', 'visible');
  map.setLayoutProperty('gendered-lines-male', 'visibility', 'visible');

  document.getElementById('console').style.display = 'none';


  ////////////////////////////////////////////////
  // Legend
  Legend()

  ////////////////////////////////////////////////
  // I want the user to be able to toggle between genders
  // The gender buttons will ideally have the same colours as their legend

  // show menu buttons
  Menu()

  ////////////////////////////////////////////////
  // Slider for temporality
  
}
);

map.on('idle', () => {

  var toggleableLayerIds = ['gendered-lines-female',  'gendered-lines-male'];

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

function Legend()
{
  var legendElements = ['Female', 'Male'];
  var legendColors = ['#34c53c', '#2b1ba1'];
  for (var i = 0; i < 2; i++)
  {
    var legendElement = legendElements[i];
    var elementColor = legendColors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = elementColor;

    var value = document.createElement('span');
    value.innerHTML = legendElement;
    item.appendChild(key);
    item.appendChild(value);

    legend.appendChild(item);
  }
}

function Menu()
{
  var keys = ['gendered-lines-female', 'gendered-lines-male'];
  var buttonLabels = ['Hide Females', 'Hide Males'];
  
  for (var i = 0; i < 2; i++)
  {
    var id = keys[i];
    var buttonLabel = buttonLabels[i];
    var link = document.createElement('a');

    // link properties
    link.href = '#';
    link.className = ''; // means it is initially inactive
    link.textContent = buttonLabel;
    link.id = id;

    // create an event handler for each menu item
    // if clicked, check the visibility of the layer
    // if visibility is 'none' set it to 'visible' and vice versa
    link.onclick = function(e) 
    {
      var clickedLayer = this.id;
      e.preventDefault();
      e.stopPropagation();
      gender = this.textContent.split(" ")[1];

      var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
      if (visibility == 'visible')
      {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
        this.textContent = 'Show '.concat(gender) ;
      }

      else
      {
        this.className = 'active';
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        this.textContent = 'Hide '.concat(gender);
      }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
  }
}

function Slider()
{

  var labels = ['Pre-Partition (before 1947-08-14)','Partition (1947-08-15 - 1948-02-28)','Post-Partition (1948-03-01 - 1971-12-16)','Long Partition (after 1971-12-16)','Indeterminable', 'Temporality not coded'];
  
  // creating event listener to catch slider movement
  document.getElementById('slider').addEventListener('input', function(e)
  {
    // where is the slider now?
    var step = parseInt(e.target.value, 10) // in decimal

    activeLayers = visibleLayers();
    console.log(activeLayers);
    for (var i = 0; i < activeLayers.length; i++)
    {
      ID = activeLayers[i];
      console.log(ID)
      map.setFilter(ID, ["==", ['number', ['get', 'temporal_sequence']], step]);
      document.getElementById('active-temporality').innerText = labels[step - 1];
    }
  })
}

function visibleLayers()
{
  var visibleLayerIds = []
  var invisibleLayerIds = []
  // case 1: both are visible
  if (map.getLayoutProperty('gendered-lines-female', 'visibility') == 'visible' && map.getLayoutProperty('gendered-lines-male', 'visibility') == 'visible')
  {
    visibleLayerIds = ['gendered-lines-female', 'gendered-lines-male'];  
  }
  // case 2: only female layer is visible
  else if (map.getLayoutProperty('gendered-lines-female', 'visibility') == 'visible')
  {
    visibleLayerIds = ['gendered-lines-female'];
  }
  // case 3: only male layer is visible
  else
  {
    visibleLayerIds = ['gendered-lines-male'];
  }

  return visibleLayerIds;
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

bearing:0,
center: [77.0688997, 28.5272803],
zoom: 3,
pitch: 0
// bearing: 45,
// center: [74.3383, 31.5767],
// zoom: 13,
// speed: 1,
// pitch: 50
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
function setActiveChapter(chapterName) 
{
  if (chapterName === activeChapterName) return;

  map.flyTo(chapters[chapterName]);

  document.getElementById(chapterName).classList.add('active');
  document.getElementById(activeChapterName).classList.remove('active');

  activeChapterName = chapterName;
}

function isElementOnScreen(id) 
{
  const element = document.getElementById(id);
  const bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}

// On every scroll event, check which element is on screen
window.onscroll = () => {

  for (const chapterName in chapters) 
  {
    
    if (isElementOnScreen(chapterName)) 
      {
        if (chapterName == 'part_3')
        {
          document.getElementById('console').style.display = 'inline';
          document.getElementById('slider').style.display = 'inline';
          console.log("We are in part 3.");
          Slider();
      
        }

        else
        {
          document.getElementById('console').style.display = 'none';
          document.getElementById('slider').style.display = 'none';
        }
        setActiveChapter(chapterName);
        break; 
        
      }
  }
};
