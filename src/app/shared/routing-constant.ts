// new updated config
export const NEW_ROUTING_CONFIG = {
  facilitator: {
    admin: {
      url: "/user/facilitator/admin",
    },
    member: {
      url: "/user/facilitator/internal-user",
    },
  },
  hospital: {
    admin: {
      url: "/user/hospital/admin",
    },
    member: {
      url: "/user/hospital/internal-user",
    },
  },
  supreme: {
    url: "/supreme/admin",
  },
};

export const GET_LOGIN_TYPE = (): any => {
  return localStorage.getItem("loginType");
};

export const getUserType = (): any => {
  return localStorage.getItem("userType");
};

export const isSupreme = () => {
  let location = window.location.href;
  return location.includes("supreme");
};

export const GET_URL_BASED_ON_LOGIN_TYPE = (): any => {
  let loginType = GET_LOGIN_TYPE();
  let userType = getUserType();
  let currentLoginConfig = NEW_ROUTING_CONFIG[loginType];
  return currentLoginConfig[userType]?.url;
};
