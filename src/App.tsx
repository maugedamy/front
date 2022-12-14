import React, { useEffect, useState, useRef } from "react";
import "./index.css";

type Product = {
  id: number;
  name: string;
  marca: string;
  price: number;
};

let idProduct: number = 0;

function App() {
  //Estado encargado de controlar cambio en productos
  const [products, setProducts] = useState<Product[]>();
  //
  const [inputs, setInputs] = useState({ name: "", marca: "", price: 0 });

  const [change, setChange] = useState(0);

  const inputNombre = useRef<HTMLInputElement>(null);
  const inputMarca = useRef<HTMLInputElement>(null);
  const inputPrice = useRef<HTMLInputElement>(null);

  //Ejecucion tras cargar el componente en el DOM
  useEffect(() => {
    //Consumo de endpoint para listar productos
    fetch("https://back-production-04ac.up.railway.app/product").then(
      (result) => {
        result.json().then((data: Product[]) => {
          //Carga de resultado del endpoint en el estado products
          setProducts(data);
        });
      }
    );
  }, [change]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (idProduct === 0) {
      //Crear
      fetch("https://back-production-04ac.up.railway.app/product", {
        method: "POST",
        body: JSON.stringify({ ...inputs, price: Number(inputs.price) }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((result) => {
        result.json().then((data) => {
          console.log(data);
          if (inputNombre.current !== null) inputNombre.current.value = "";
          if (inputMarca.current !== null) inputMarca.current.value = "";
          if (inputPrice.current !== null) inputPrice.current.value = "";

          setChange(change + 1);
        });
      });
    } else {
      //Editar
      fetch(
        `https://back-production-04ac.up.railway.app/product/${idProduct}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...inputs }),
        }
      ).then((result) => {
        result.json().then((data) => {
          console.log(data);
          if (inputNombre.current !== null) inputNombre.current.value = "";
          if (inputMarca.current !== null) inputMarca.current.value = "";
          if (inputPrice.current !== null) inputPrice.current.value = "";
          idProduct = 0;
          setChange(change + 1);
        });
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    inputs[e.target.name] = e.target.value;
    setInputs({ ...inputs });
  };

  console.log("inputs", inputs);

  const handleEdition = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    if (inputNombre.current !== null) inputNombre.current.value = product.name;
    if (inputMarca.current !== null) inputMarca.current.value = product.marca;
    idProduct = product.id;
    // if (inputPrice.current !== null)
    //   inputPrice.current.value = String(product.price);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    fetch(`https://back-production-04ac.up.railway.app/product/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((result) => {
      result.json().then((data) => {
        console.log(data);
        setChange(change + 1);
      });
    });
  };

  return (
    <div>
      <h1 className="centered">Products Management</h1>
      <form onSubmit={handleSubmit} className="centered form">
        <input
          className="centered inputs"
          ref={inputNombre}
          placeholder={"name"}
          name={"name"}
          onChange={handleChange}
        />

        <input
          className="centered inputs"
          ref={inputMarca}
          placeholder={"marca"}
          name={"marca"}
          onChange={handleChange}
        />

        <input
          className="centered inputs"
          ref={inputPrice}
          placeholder={"price"}
          type={"number"}
          name={"price"}
          onChange={handleChange}
        />

        <button>Enviar</button>
      </form>

      <div className="inline">
        {products?.map((product) => {
          return (
            <div className="flex width100">
              <div key={product.id} className="m-1 width100">
                <div className="bg-primary p-1 flex width100">
                  <div className="centered m-1">
                    <p>{product.name}</p>
                  </div>

                  <div className="centered m-1">
                    <p>{product.marca}</p>
                  </div>

                  <div className="centered m-1">
                    <p>{product.price}</p>
                  </div>

                  <button
                    className="centered m-1 button"
                    onClick={(e) => handleEdition(e, product)}
                  >
                    Edit
                  </button>
                  <button
                    className="centered m-1 button"
                    onClick={(e) => handleDelete(e, product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
