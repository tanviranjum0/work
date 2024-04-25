const page = ({ params }) => {
  console.log(params);
  // console.log(searchParams);
  return (
    <div>
      {params.id.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </div>
  );
};

export default page;
