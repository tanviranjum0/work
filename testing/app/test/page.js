const page = async () => {
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      grant_type:
        "client_credentials&client_id=2bwVwkjGtQ26gZ69vG9ji3b7xdgo4Y1L&client_secret=H5BPU8XvnXbKuMD6",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  return (
    <div>
      <div className="p-10"></div>
    </div>
  );
};

export default page;
