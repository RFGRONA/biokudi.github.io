import React from "react";
import Create from "../CRUD_Layout/Create";
import Header2 from "../header/Header2";
import Footer from "../footer/Footer";
import { placeCreateMapping } from "../../utils/mapping/placeMapping";
import { ValidatePlaceForm } from "../../utils/validate/ValidatePlaceForm";
import { useState } from "react";
import { useEffect } from "react";
import { createPlaceApi } from "../../services/apiModel/PlaceApi";
import SuccessAlert from "../helpers/alerts/SuccessAlert";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../helpers/alerts/ErrorAlert";
import { useAuth } from "../../context/AuthContext";
import Loading from "../helpers/loading/Loading";

const CreatePlace = () => {
  const [fields, setFields] = useState([]);
  const [errors, setErrors] = useState({});
  const { loading, setLoading } = useAuth();
  const navigate = useNavigate();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchFields = async () => {
      const placeMapping = await placeCreateMapping();
      setFields(placeMapping.fields);
    };

    fetchFields();
  }, []);

  /*Errors handle */
  const handleCreate = async (data) => {
    setLoading(true);
    const errors = await ValidatePlaceForm(data);
    setErrors(errors);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      console.log(data);
      const response = await createPlaceApi(data);
      if (response.status === 200) {
        {
          /*TODO: Sucessfull screen */
        }

        navigate("/places");
      } else {
        setAlertMessage("Error al crear lugar");
        setShowErrorAlert(true);
      }
    } catch (error) {
      setErrors({ general: "Error al crear lugar" });
      setAlertMessage("Error al crear lugar");
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header2 />
      {showErrorAlert && <ErrorAlert message={alertMessage} />}
      {loading ? (
        <Loading />
      ) : (
        <Create
          title={"Lugares"}
          fields={fields}
          onSubmit={handleCreate}
          errors={errors}
        />
      )}

      <Footer />
    </>
  );
};

export default CreatePlace;
