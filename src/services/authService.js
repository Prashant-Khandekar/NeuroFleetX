import api from "./api";

const authService = {
 login: async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: { name: "Test User", email },
        token: "dummy-jwt-token",
        role: email.includes("admin") ? "admin" : email.includes("driver") ? "driver" : "passenger"
      });
    }, 800);
  });
},

register: async (name, email, password, role) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: { name, email, role },
        token: "dummy-jwt-token",
        role: role
      });
    }, 800);
  });
},

};

export default authService;
