const App = () => {
  const handler = async () => {
    const result = await fetch("http://localhost:3000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: 1,
            quantity: 2,
          },
          {
            id: 2,
            quantity: 3,
          },
        ],
      }),
    });
    const data = await result.json();
    console.log(data);
    window.location.href = data.url;
  };
  return (
    <div>
      <button onClick={() => handler()}>Checkout</button>
    </div>
  );
};

export default App;
