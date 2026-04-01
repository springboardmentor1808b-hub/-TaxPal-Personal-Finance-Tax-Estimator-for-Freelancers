import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`
});


// ================= SIGNUP =================
export const signupUser = async (data) => {
  const res = await API.post("/signup", data);
  return res.data;
};


// ================= LOGIN =================
export const loginUser = async (data) => {
  const res = await API.post("/login", data);

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (data) => {

  const token = localStorage.getItem("token");

  const res = await API.put(
    "/update-profile",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  // Update stored user data
  if (res.data.user) {
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};