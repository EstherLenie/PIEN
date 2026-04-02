const host = "http://localhost:8080/api/utilisateurs";

const USER = {};

USER.LOGIN = ({ email, password, role }) => ({
  method: "POST",
  url: host + "/login",
  body: { email, password, role },
});

USER.ME = () => ({
  method: "GET",
  url: host + "/me",
});

export default USER;
