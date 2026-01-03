const host = "/api/multimedia";

const MULTIMEDIA = {};

MULTIMEDIA.GET_FILE = (url) => host + "/" + url;

MULTIMEDIA.UPLOAD_FILE = ({ file, filename }) => {
  const formData = new FormData();
  formData.append("file", file, filename);

  return {
    url: host,
    formData,
  };
};

export default MULTIMEDIA;
