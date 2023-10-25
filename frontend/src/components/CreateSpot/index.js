import { csrfFetch } from "../../store/csrf";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal";

function CreateSpot() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const { setModalContent } = useModal();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [previewImg, setPreviewImg] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");

  const [errors, setErrors] = useState({});

  const createImage = async (image, id, preview = false) => {
    if (image === "") return;
    const res = await csrfFetch(`/api/spots/${id}/images`, {
      method: "POST",
      body: JSON.stringify({
        url: image,
        preview,
      }),
    });
    return res;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (user) {
      // if logged in user
      if (previewImg === "") {
        return setErrors({ previewImg: "Preview image is required." });
      }

      //   validate images
      const images = [previewImg, img1, img2, img3, img4];
      const imagesString = ["previewImg", "img1", "img2", "img3", "img4"];
      const imgErrors = {};
      for (let i = 0; i < images.length; i++) {
        let image = images[i];
        if (
          image !== "" &&
          !(
            image.endsWith(".png") ||
            image.endsWith(".jpeg") ||
            image.endsWith(".jpg")
          )
        ) {
          imgErrors[imagesString[i]] =
            "Image URL must end with .png, .jpeg, or .jpg";
        }
      }
      if (Object.keys(imgErrors).length) return setErrors(imgErrors);

      //   validate description
      if (description.length < 30)
        return setErrors({
          description: "Description should be at least 30 characters",
        });

      const newSpot = await dispatch(
        createSpot({
          country,
          address,
          city,
          state,
          lat,
          lng,
          description,
          name,
          price,
          ownerId: user.id,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });

      if (newSpot) {
        createImage(previewImg, newSpot.id, true);
        createImage(img1, newSpot.id);
        createImage(img2, newSpot.id);
        createImage(img3, newSpot.id);
        createImage(img4, newSpot.id);
        history.push(`/spots/${newSpot.id}`);
      }
    } else {
      // if no logged in user
      setModalContent(<LoginFormModal />);
    }
  };
  return (
    <>
      <h1>Create a new Spot</h1>
      <form onSubmit={onSubmit}>
        <h2>Where's your place located?</h2>
        <h3>
          Guests will only get your exact address once they booked a
          reservation.
        </h3>
        <label>
          Country{" "}
          {errors.country && <span className="err">{errors.country}</span>}
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label>
          Street Address{" "}
          {errors.address && <span className="err">{errors.address}</span>}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label>
          City {errors.city && <span className="err">{errors.city}</span>}
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>
          State {errors.state && <span className="err">{errors.state}</span>}
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        <label>
          Latitude {errors.lat && <span className="err">{errors.lat}</span>}
          <input
            type="number"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
        <label>
          Longitude {errors.lng && <span className="err">{errors.lng}</span>}
          <input
            type="number"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </label>
        <hr />
        <h2>Describe your place to guests</h2>
        <h3>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </h3>
        <textarea
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <span className="err">{errors.description}</span>
        )}
        <hr />
        <h2>Create a title for your spot</h2>
        <h3>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </h3>
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="err">{errors.name}</span>}
        <hr />
        <h2>Set a base price for your spot</h2>
        <h3>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </h3>
        $
        <input
          type="number"
          placeholder="Price per night (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <span className="err">{errors.price}</span>}
        <hr />
        <h2>Liven up your spot with photos</h2>
        <h3>Submit a link to at least one photo to publish your spot.</h3>
        <input
          type="url"
          placeholder="Preview Image URL"
          value={previewImg}
          onChange={(e) => setPreviewImg(e.target.value)}
        />
        {errors.previewImg && <span className="err">{errors.previewImg}</span>}
        <input
          type="url"
          placeholder="Image URL"
          value={img1}
          onChange={(e) => setImg1(e.target.value)}
        />
        {errors.img1 && <span className="err">{errors.img1}</span>}
        <input
          type="url"
          placeholder="Image URL"
          value={img2}
          onChange={(e) => setImg2(e.target.value)}
        />
        {errors.img2 && <span className="err">{errors.img2}</span>}
        <input
          type="url"
          placeholder="Image URL"
          value={img3}
          onChange={(e) => setImg3(e.target.value)}
        />
        {errors.img3 && <span className="err">{errors.img3}</span>}
        <input
          type="url"
          placeholder="Image URL"
          value={img4}
          onChange={(e) => setImg4(e.target.value)}
        />
        {errors.img4 && <span className="err">{errors.img4}</span>}
        <button>Create Spot</button>
      </form>
    </>
  );
}

export default CreateSpot;
