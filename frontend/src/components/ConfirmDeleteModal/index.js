import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot, getAllCurrentSpots } from "../../store/spots";
import { useState } from "react";

function ConfirmDeleteModal({ id }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});

  const confirmDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(id))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
    return dispatch(getAllCurrentSpots());
  };

  const confirmKeep = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <>
      <h2>Confirm Delete</h2>
      <div>
        <h3>Are you sure you want to remove this spot?</h3>
        {errors && <p className="err">oh snap</p>}
        <div>
          <button onClick={confirmDelete}>Yes (Remove Spot)</button>
          <button onClick={confirmKeep}>No (Keep Spot)</button>
        </div>
      </div>
    </>
  );
}

export default ConfirmDeleteModal;
