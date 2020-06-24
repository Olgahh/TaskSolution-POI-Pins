import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import pin from "../image/pin.png";
import data from "../data";

function MapBox() {
  const [viewport, setViewport] = useState({
    latitude: 50.5158092,
    longitude: 30.5846251,
    zoom: 10,
    width: "100vw",
    height: "100vh",
  });

  const [selectedData, setSelectedData] = useState(null);
  const [restaurants, setRestaurants] = useState(data);
  const [time, setTime] = useState("None");
  const [price, setPrice] = useState("None");

  const handleChange = () => {
    if (price !== "None") {
      if (time === "Morning")
        setRestaurants(
          data.filter(
            (restaurant) =>
              restaurant.opening_time.morning && restaurant.price === price
          )
        );
      else if (time === "Evening")
        setRestaurants(
          data.filter(
            (restaurant) =>
              restaurant.opening_time.evening && restaurant.price === price
          )
        );
      else
        setRestaurants(data.filter((restaurant) => restaurant.price === price));
    } else {
      if (time === "Morning")
        setRestaurants(
          data.filter((restaurant) => restaurant.opening_time.morning)
        );
      else if (time === "Evening")
        setRestaurants(
          data.filter((restaurant) => restaurant.opening_time.evening)
        );
      else setRestaurants(data);
    }
  };

  const timesOpen = () => {
    if (
      selectedData.opening_time.morning === true &&
      selectedData.opening_time.evening === true
    )
      return "Open from 9am - 12am";
    else if (selectedData.opening_time.morning === true)
      return "Open from 8am - 12 pm";
    else return "Open from 2pm - 12am";
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport) => {
        setViewport(viewport);
      }}
    >
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.title}
          latitude={restaurant.lat}
          longitude={restaurant.lng}
        >
          <button
            className="pin"
            onClick={(e) => {
              e.preventDefault();
              setSelectedData(restaurant);
            }}
          >
            <img src={pin} width="15vw" alt="pin" />
          </button>
        </Marker>
      ))}
      {selectedData && (
        <Popup
          latitude={selectedData.lat}
          longitude={selectedData.lng}
          onClose={() => setSelectedData(null)}
        >
          <div>
            <div className="list-group">
              <div className="d-flex w-100 justify-content-between my-3 ">
                <h5 className="mb-1">{selectedData.title}</h5>
              </div>
              <small>
                {selectedData.price === "premium" ? (
                  <>
                    Price: $$$ <span style={{ color: "green" }}>Premium</span>
                  </>
                ) : (
                  <>
                    Price: $ <span style={{ color: "green" }}>Normal</span>
                  </>
                )}
              </small>
              <small className="mb-1">{timesOpen()}</small>
            </div>
          </div>
        </Popup>
      )}
      <div className="card w-25 mr-auto mt-3 ml-3">
        <h5 className="card-header  text-center">Filter By </h5>
        <div className="card-body">
          <div className="form-group-sm">
            <label for="validationDefault04">Opening Time</label>
            <select
              class="custom-select"
              id="validationDefault04"
              required
              onChange={(e) => {
                setTime(e.target.value);
              }}
              value={time}
            >
              <option value="None">None</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
            <label for="validationDefault04">Price</label>
            <select
              class="custom-select"
              id="validationDefault04"
              required
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              value={price}
            >
              <option value="None">None</option>
              <option value="premium">Premium</option>
              <option value="normal">Normal</option>
            </select>
            <button
              type="button"
              className="btn btn-sm btn-secondary my-3"
              onClick={() => handleChange()}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </ReactMapGL>
  );
}

export default MapBox;
