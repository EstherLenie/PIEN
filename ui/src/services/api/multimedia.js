const host = "http://localhost/api/multimedia";

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
MULTIMEDIA.DOWNLOAD = ({ url, filename }) => {
  return {
    url: host + "/" + url,
    filename,
  };
};

export default MULTIMEDIA;
