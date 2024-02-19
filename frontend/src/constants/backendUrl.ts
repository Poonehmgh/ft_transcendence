
const backendUrl = {
    base: process.env.REACT_APP_BACKEND_URL,
    user: process.env.REACT_APP_BACKEND_URL + "/user/",
    chat: process.env.REACT_APP_BACKEND_URL + "/chat/",
    game: process.env.REACT_APP_BACKEND_URL + "/game/",
    auth: process.env.REACT_APP_BACKEND_URL + "/auth/",
};

export default backendUrl;
