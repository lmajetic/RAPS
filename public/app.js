window.onload = function() {
    // Initialize map
    var map = L.map('map').setView([45.1, 15.2], 6);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    // Function to display stations in the clicked city
    function displayStationsInCity(cityName) {
        const stationsContainer = document.getElementById('stations');
        stationsContainer.innerHTML = '';

        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreDropdown.value;
        const showFavoritesOnly = favoritesCheckbox.checked;

        const filteredStations = radioStations.filter(station =>
            extractCityName(station.Title) === cityName &&
            station.Title.toLowerCase().includes(searchTerm) &&
            (selectedGenre === "" || station.Genre === selectedGenre) &&
            (!showFavoritesOnly || userFavorites.includes(station.Title))
        );

        filteredStations.forEach(station => {
            const stationDiv = document.createElement('div');
            stationDiv.classList.add('stationItem');
            stationDiv.textContent = station.Title;
            stationDiv.addEventListener('click', function () {
                document.getElementById('stationDetails').innerHTML = `
                    <h3>${station.Title}</h3>
                    <p>Description: ${station.Description}</p>
                    <p>Genre: ${station.Genre}</p>
                    <p>Country: ${station.Country}</p>
                    <p>Language: ${station.Language}</p>
                    <button id="toggleFavorite">Toggle Favorite</button>
                `;
                playStationStream(station.Source1);
                document.getElementById('toggleFavorite').addEventListener('click', () => {
                    toggleFavorite(station.Title);
                });
            });
            stationsContainer.appendChild(stationDiv);
        });
    }


    // List of predefined cities
    const cities = {
        // Croatia
        'Zagreb': [45.8150, 15.9819],
        'Split': [43.5081, 16.4402],
        'Rijeka': [45.3271, 14.4422],
        'Osijek': [45.5540, 18.6955],
        'Zadar': [44.1194, 15.2314],
        'Pula': [44.8666, 13.8496],
        'Šibenik': [43.7350, 15.8896],
        'Dubrovnik': [42.6507, 18.0944],
        'Varaždin': [46.3059, 16.3366],
        'Sisak': [45.4872, 16.3714],
        'Makarska': [43.2967, 17.0171],
        'Velika Mlaka': [45.7333, 16.0500],
        'Rovinj': [45.0800, 13.6400],
        'Vukovar': [45.3515, 19.0050],
        'Karlovac': [45.4872, 15.5470],
        'Bjelovar': [45.8986, 16.8489],
        'Čakovec': [46.3844, 16.4339],
        'Koprivnica': [46.1628, 16.8275],
        'Požega': [45.3400, 17.6856],
        'Vinkovci': [45.2870, 18.8043],
        'Slavonski Brod': [45.1603, 18.0156],
        'Trogir': [43.5172, 16.2503],
        'Krapina': [46.1600, 15.8767],
        'Petrinja': [45.4375, 16.2906],
        'Križevci': [46.0211, 16.5422],
        'Vrbovec': [45.8833, 16.4167],
        'Zaprešić': [45.8561, 15.8072],
        // Ireland
        'Dublin': [53.3498, -6.2603],
        'Cork': [51.8985, -8.4756],
        'Limerick': [52.6680, -8.6305],
        'Galway': [53.2707, -9.0568],
        'Waterford': [52.2593, -7.1101],
        'Drogheda': [53.7179, -6.3561],
        'Dundalk': [54.0033, -6.4168],
        'Swords': [53.4597, -6.2181],
        'Bray': [53.2009, -6.1111],
        'Navan': [53.6528, -6.6810],
        // United Kingdom
        'London': [51.5074, -0.1278],
        'Manchester': [53.4808, -2.2426],
        'Birmingham': [52.4862, -1.8904],
        'Glasgow': [55.8642, -4.2518],
        'Liverpool': [53.4084, -2.9916],
        'Edinburgh': [55.9533, -3.1883],
        'Bristol': [51.4545, -2.5879],
        'Leeds': [53.8008, -1.5491],
        'Sheffield': [53.3811, -1.4701],
        'Newcastle': [54.9783, -1.6174],
        // Germany
        'Berlin': [52.5200, 13.4050],
        'Hamburg': [53.5511, 9.9937],
        'Munich': [48.1351, 11.5820],
        'Cologne': [50.9375, 6.9603],
        'Frankfurt': [50.1109, 8.6821],
        'Stuttgart': [48.7758, 9.1829],
        'Düsseldorf': [51.2277, 6.7735],
        'Dortmund': [51.5136, 7.4653],
        'Essen': [51.4556, 7.0116],
        'Leipzig': [51.3397, 12.3731],
        // France
        'Paris': [48.8566, 2.3522],
        'Marseille': [43.2965, 5.3698],
        'Lyon': [45.7640, 4.8357],
        'Toulouse': [43.6045, 1.4442],
        'Nice': [43.7102, 7.2620],
        'Nantes': [47.2184, -1.5536],
        'Strasbourg': [48.5734, 7.7521],
        'Montpellier': [43.6108, 3.8767],
        'Bordeaux': [44.8378, -0.5792],
        'Lille': [50.6292, 3.0573],
        // Poland
        'Warsaw': [52.2297, 21.0122],
        'Kraków': [50.0647, 19.9450],
        'Łódź': [51.7592, 19.4560],
        'Wrocław': [51.1079, 17.0385],
        'Poznań': [52.4064, 16.9252],
        'Gdańsk': [54.3520, 18.6466],
        'Szczecin': [53.4285, 14.5528],
        'Bydgoszcz': [53.1235, 18.0084],
        'Lublin': [51.2465, 22.5684],
        'Katowice': [50.2649, 19.0238],
        // Spain
        'Madrid': [40.4168, -3.7038],
        'Barcelona': [41.3851, 2.1734],
        'Valencia': [39.4699, -0.3763],
        'Seville': [37.3891, -5.9845],
        'Zaragoza': [41.6488, -0.8891],
        'Málaga': [36.7213, -4.4214],
        'Murcia': [37.9922, -1.1307],
        'Palma': [39.5696, 2.6502],
        'Las Palmas': [28.1235, -15.4363],
        'Bilbao': [43.2630, -2.9350],
        // Italy
        'Rome': [41.9028, 12.4964],
        'Milan': [45.4642, 9.1900],
        'Naples': [40.8518, 14.2681],
        'Turin': [45.0703, 7.6869],
        'Palermo': [38.1157, 13.3615],
        'Genoa': [44.4056, 8.9463],
        'Bologna': [44.4949, 11.3426],
        'Florence': [43.7696, 11.2558],
        'Bari': [41.1171, 16.8719],
        'Catania': [37.5079, 15.0830]
    };

    // Function to extract city name from station title
    function extractCityName(title) {
        return Object.keys(cities).find(city => title.includes(city));
    }

    // Populate genre dropdown
    const genreDropdown = document.getElementById('genreDropdown');
    const genres = [...new Set(radioStations.map(station => station.Genre))].sort();
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreDropdown.appendChild(option);
    });

    // Use the imported radio stations data
    radioStations.forEach(station => {
        // Defined extractCityName function called
        const cityName = extractCityName(station.Title);
        if (cityName) {
            const coordinates = cities[cityName];
            // Create a marker
            var marker = L.marker(coordinates).addTo(map);
            marker.bindPopup(`<b>${cityName}</b><br>${station.Country}`);

            // Add a click event to displayed stations in the clicked city
            marker.on('click', function() {
                displayStationsInCity(cityName);
            });
        } else {
            console.warn('No city name found in station title:', station);
        }
    });

    // Search and display radio stations
    const stationsContainer = document.getElementById('stations');
    const searchInput = document.getElementById('searchBox');

    // Filter stations
    function filterStations() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreDropdown.value;
        const showFavoritesOnly = favoritesCheckbox.checked;
        const sortOrder = document.getElementById('sortOrder').value;

        stationsContainer.innerHTML = '';

        let filteredStations = radioStations.filter(station =>
            station.Title.toLowerCase().includes(searchTerm) &&
            (selectedGenre === "" || station.Genre === selectedGenre) &&
            (!showFavoritesOnly || userFavorites.includes(station.Title))
        );

        // Sort stations
        filteredStations.sort((a, b) => {
            const titleA = a.Title.toLowerCase();
            const titleB = b.Title.toLowerCase();
            return sortOrder === 'asc'
                ? titleA.localeCompare(titleB)
                : titleB.localeCompare(titleA);
        });

        filteredStations.forEach(station => {
            const cityName = extractCityName(station.Title);
            if (cityName) {
                const stationDiv = document.createElement('div');
                stationDiv.classList.add('stationItem');
                stationDiv.textContent = station.Title;
                stationDiv.addEventListener('click', function () {
                    document.getElementById('stationDetails').innerHTML = `
                        <h3>${station.Title}</h3>
                        <p>Description: ${station.Description}</p>
                        <p>Genre: ${station.Genre}</p>
                        <p>Country: ${station.Country}</p>
                        <p>Language: ${station.Language}</p>
                        <button id="toggleFavorite">Toggle Favorite</button>
                    `;
                    playStationStream(station.Source1);
                    document.getElementById('toggleFavorite').addEventListener('click', () => {
                        toggleFavorite(station.Title);
                    });
                });
                stationsContainer.appendChild(stationDiv);
            }
        });
    }


    function toggleFavorite(title) {
        if (!userId) {
            alert('You need to log in first!');
            return;
        }
    
        const isFavorite = userFavorites.includes(title);
        const url = isFavorite ? '/favorites/remove' : '/favorites/add';
    
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, radioStation: title })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (isFavorite) {
                    userFavorites = userFavorites.filter(t => t !== title);
                } else {
                    userFavorites.push(title);
                }
                filterStations();
            }
        })
        .catch(err => console.error('Error toggling favorite:', err));
    }


    let userId = sessionStorage.getItem('userId');
    let userFavorites = [];
    const favoritesCheckbox = document.getElementById('favoritesOnly');
    loadFavorites();

    // Load favorites for this user
    function loadFavorites() {
        if (!userId) return;

        fetch(`/favorites/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    userFavorites = data.favorites;
                    filterStations(); 
                }
            })
            .catch(err => console.error('Error loading favorites:', err));
    }

    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');

    function playStationStream(url) {
        // First try direct stream
        audioSource.src = url;
        audioPlayer.load();

        // Set fallback on error
        audioPlayer.onerror = () => {
            console.warn('Direct stream failed, retrying via proxy...');

            // Retry using proxy
            audioSource.src = `/proxy?url=${encodeURIComponent(url)}`;
            audioPlayer.load();

            // Remove the error handler to avoid infinite loop
            audioPlayer.onerror = null;
        };

        audioPlayer.play().catch(err => {
            console.error('Initial playback error:', err);
        });
    }


    // Initial display of all stations
    filterStations();

    // Event listeners for input change and genre selection
    searchInput.addEventListener('input', filterStations);
    favoritesCheckbox.addEventListener('change', () => {
        filterStations();
    });
    document.getElementById('sortOrder').addEventListener('change', filterStations);


};
