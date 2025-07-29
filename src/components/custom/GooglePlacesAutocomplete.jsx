import React, { useState, useEffect, useRef } from 'react';

const GooglePlacesAutocomplete = ({ onPlaceSelect, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  // Debug: log predictions on every render
  console.log('Dropdown predictions:', predictions);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        // Check if new API is available, fallback to old one
        if (window.google.maps.places.AutocompleteSuggestion) {
          console.log('✅ Using new AutocompleteSuggestion API');
        } else {
          console.log('⚠️ Using legacy AutocompleteService API');
        }
      } else {
        setTimeout(loadGoogleMaps, 100);
      }
    };
    loadGoogleMaps();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 2 && window.google && window.google.maps) {
      // Use new API if available, otherwise fallback to old one
      if (window.google.maps.places.AutocompleteSuggestion) {
        // New API implementation
        const request = {
          input: value,
          includedPrimaryTypes: ['locality', 'administrative_area_level_1'],
          language: 'en',
          region: 'us'
        };
        
        window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
          .then((response) => {
            if (response.suggestions) {
              const formattedPredictions = response.suggestions.map(suggestion => {
                // Safe access to nested properties
                const placePrediction = suggestion.placePrediction || {};
                const text = placePrediction.text || {};
                const structuredFormat = placePrediction.structuredFormat || {};
                const mainText = structuredFormat.mainText || {};
                const secondaryText = structuredFormat.secondaryText || {};
                
                return {
                  place_id: placePrediction.placeId || '',
                  description: text.text || '',
                  structured_formatting: {
                    main_text: mainText.text || '',
                    secondary_text: secondaryText.text || ''
                  }
                };
              });
              setPredictions(formattedPredictions);
              setShowDropdown(true);
            }
          })
          .catch((error) => {
            console.error('Error fetching suggestions:', error);
            setPredictions([]);
            setShowDropdown(false);
          });
      } else {
        // Legacy API implementation
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions(
          {
            input: value,
            types: ['(cities)']
          },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPredictions(predictions || []);
              setShowDropdown(true);
            }
          }
        );
      }
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  const handlePlaceClick = (prediction) => {
    const description = prediction.description || prediction.structured_formatting?.main_text || 'Unknown location';
    const mainText = prediction.structured_formatting?.main_text || description;
    
    setInputValue(description);
    setShowDropdown(false);
    onPlaceSelect({
      formatted_address: description,
      place_id: prediction.place_id || '',
      name: mainText
    });
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder || "Enter destination"}
        className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              onClick={() => handlePlaceClick(prediction)}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 bg-white"
            >
              <div className="font-medium bg-white" style={{ color: 'black', fontWeight: '500' }}>{prediction.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;





