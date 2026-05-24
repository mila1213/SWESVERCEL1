import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPassword(token, newPassword);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al cambiar contraseña");
    }
  };

  return (
    <section className="card">
      <h2>Nueva contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button>Cambiar contraseña</button>
      </form>
      <p>{message}</p>
    </section>
  );
}

export default ResetPassword;