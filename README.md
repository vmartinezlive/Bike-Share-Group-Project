# Bike Share Map

#### November 5th, 2018

## Contributors

#### By **Paige Williams, Tanvi Garg, Phil Mass, Victoria Martinez**

## Description

_You can view the deployed page [here](https://paigewilliams.github.io/Bike-Share-Group-Project/)._

## Setup and Installation

* Clone the project from https://github.com/paigewilliams/Bike-Share-Group-Project.git to a local directory
* Open index.html in a browser

## Support and Contact Details

If you have any issues or questions, please email me at paw145@humboldt.edu

## Specifications:
### MVP:
#### Business logic:
1. Define 5 bike stations as a dataset for our static map
2. Add station properties from the Biketown datasets (station name, coordinates, address, id, number of bikes, number of bike racks, selected)
3. Add properties to map object (stations, center coordinates, zoom level)
4. Add user object (favorite stations, name)
5. Add all stations to map.
6. Add method to find station that user has selected based off of unique id.

#### UI Logic
1. Fixed map of Downtown Portland.
2. Add list of stations to form.
3. User selects a station and show details about that station.
4. User can select favorite stations and add them to their favorite station list.
5. Draw stations on the map.
6. Users favorite stations are selected on the map.
7. User clicks on station on the map and details about that station appear below the form.
8. Gather station id from map click and return station information.
9. User adds to favorites with add button.
10. User deletes favorites with delete button.
11. Add MapDisplay object(leafletMap, marker, markerSelected, iconStatus x 4).
12. Add function to change marker when station is selected.

### Good to have:
1. Use custom icon for stations.
2. Use complete Biketown data.
3. Improve styling.
4. Test all functionality.

### Excellent to have:
1. Add pop-up feature to map when station is clicked.
2. Use better tiles.
3. User can create an account and save their favorites.
4. Add reserve functionality.
5. Remove empty arrays in favorite stations (sort and then pop out empty arrays).



## Technologies used
1. **Custom CSS**
2. **JQuery and JavaScript**
3. **HTML5**
4. **Atom**
5. **Command Line**
6. **GitHub**
7. **Leaflet**

## Known Bugs
No known bugs.

## Legal

Copyright (c) 2018 Paige Williams, Tanvi Garg, Phil Mass, Victoria Martinez

Licensed under the MIT License
