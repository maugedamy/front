import { useEffect, useState } from "react";
// import "./styles.css";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
};

function App() {
  const [products, setProducts] = useState<Product[]>();
  const [inputs, setInputs] = useState({ name: "", brand: "", price: 0 });
  useEffect(() => {
    fetch("https://expresspostman-production.up.railway.app/product").then(
      (result) => {
        result.json().then((data: Product[]) => {
          setProducts(data);
        });
      }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("https://expresspostman-production.up.railway.app/product", {
      method: "POST",
      body: JSON.stringify({ ...inputs, price: Number(inputs.price) }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((result) => {
      result.json().then((data) => {
        console.log(data);
      });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    inputs[e.target.name] = e.target.value;
    setInputs({ ...inputs });
  };

  console.log("inputs", inputs);

  return (
    <div>
      <div className="d-flex m-1">
        {products?.map((product) => {
          return (
            <div className="d-flex">
              <div key={product.id} className="m-1">
                <div className="bg-primary p-1">
                  <p>{product.name}</p>
                  <p>{product.brand}</p>
                  <p>{product.price}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <input placeholder={"name"} name={"name"} onChange={handleChange} />
        <input placeholder={"brand"} name={"brand"} onChange={handleChange} />
        <input
          placeholder={"price"}
          type={"number"}
          name={"price"}
          onChange={handleChange}
        />
        <button>Crear</button>
      </form>
    </div>
  );
}

export default App;
