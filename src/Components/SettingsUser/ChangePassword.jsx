import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import Header from "../header/Header2";
import Footer from "../footer/Footer";
import Loading from "../helpers/loading/Loading";
import Success from "../helpers/alerts/SuccessAlert";
import ErrorAlert from "../helpers/alerts/ErrorAlert";
import Decision from "../helpers/alerts/DecisionAlert";
import {
  validateChangePasswordForm,
  validateField,
} from "../../utils/validate/ValidateChangePasswordForm";
import { updatePasswordApi } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = () => {
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);

    // Validate the specific field
    const fieldErrors = validateField(name, value, updatedValues);
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (fieldErrors[name]) {
        // There is an error
        newErrors[name] = fieldErrors[name];
      } else {
        // No error, remove the field from errors
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const handleDecision = (e) => {
    e.preventDefault(); // Prevent form submission
    setDecision(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);

    // Validate the entire form
    const validationErrors = validateChangePasswordForm(formValues);
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Call your API function to update the password
        const response = await updatePasswordApi({
          currentPassword: formValues.currentPassword,
          newPassword: formValues.newPassword,
        });

        if (response.status === 200) {
          setMessage("Contraseña actualizada con éxito.");
          setSuccess(true);
        } else {
          setMessage(response.message || "Error al actualizar la contraseña.");
          setError(true);
        }
      } catch (error) {
        setMessage("Error al actualizar la contraseña.");
        setError(true);
      } finally {
        setLoading(false);
        setIsSubmitting(false);
      }
    } else {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={`mainContainer ${styles.mainContent}`}>
        {decision && (
          <Decision
            message="¿Estás seguro que deseas cambiar tu contraseña?"
            onConfirm={() => {
              handleSubmit();
              setDecision(false);
            }}
            cancelText={"Cancelar Cambio"}
            onCancel={() => setDecision(false)}
          />
        )}

        {error && (
          <ErrorAlert message={message} onClose={() => setError(false)} />
        )}
        {success && (
          <Success
            message={message}
            onClose={() => {
              setSuccess(false);
              navigate("/profile");
            }}
          />
        )}
        {loading ? (
          <Loading />
        ) : (
          <>
            <h1 className={styles.title}>Cambiar Contraseña</h1>
            <form className={styles.form} onSubmit={handleDecision}>
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword" className={styles.label}>
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  placeholder="Ingresa tu contraseña actual"
                  className={`${styles.input} ${
                    formErrors.currentPassword ? styles.inputError : ""
                  }`}
                  value={formValues.currentPassword}
                  onChange={handleFieldChange}
                  required
                  aria-invalid={!!formErrors.currentPassword}
                  aria-describedby="current-password-error"
                />
                {formErrors.currentPassword && (
                  <p
                    id="current-password-error"
                    className={styles.errorMessage}
                  >
                    {formErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  placeholder="Ingresa tu nueva contraseña"
                  className={`${styles.input} ${
                    formErrors.newPassword ? styles.inputError : ""
                  }`}
                  value={formValues.newPassword}
                  onChange={handleFieldChange}
                  required
                  aria-invalid={!!formErrors.newPassword}
                  aria-describedby="new-password-error"
                />
                {formErrors.newPassword && (
                  <p id="new-password-error" className={styles.errorMessage}>
                    {formErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className={styles.formGroup}>
                <label htmlFor="confirmNewPassword" className={styles.label}>
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  placeholder="Confirma tu nueva contraseña"
                  className={`${styles.input} ${
                    formErrors.confirmNewPassword ? styles.inputError : ""
                  }`}
                  value={formValues.confirmNewPassword}
                  onChange={handleFieldChange}
                  required
                  aria-invalid={!!formErrors.confirmNewPassword}
                  aria-describedby="confirm-new-password-error"
                />
                {formErrors.confirmNewPassword && (
                  <p
                    id="confirm-new-password-error"
                    className={styles.errorMessage}
                  >
                    {formErrors.confirmNewPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={
                  isSubmitting ||
                  Object.keys(formErrors).length > 0 ||
                  !formValues.currentPassword ||
                  !formValues.newPassword ||
                  !formValues.confirmNewPassword
                }
              >
                {isSubmitting ? "Enviando..." : "Cambiar Contraseña"}
              </button>
            </form>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ChangePasswordForm;
