// Everything that differs between the rider app and the driver app lives here, so screens
// can be written once and parameterised by role.
export const ROLES = {
  user: {
    key: "user",
    label: "Rider",
    other: "captain",
    home: "/home",
    login: "/login",
    signup: "/signup",
    history: "/user/rides",
    profile: "/user/edit-profile",
    profileEndpoint: "/user/profile",
  },
  captain: {
    key: "captain",
    label: "Driver",
    other: "user",
    home: "/captain/home",
    login: "/captain/login",
    signup: "/captain/signup",
    history: "/captain/rides",
    profile: "/captain/edit-profile",
    profileEndpoint: "/captain/profile",
  },
};

export const roleOf = (key) => ROLES[key] || ROLES.user;
