import React, { useState } from "react";

const ObjectManager = () => {
  const [name, setName] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [response, setResponse] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editFeatures, setEditFeatures] = useState("");
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();

    const objectData = {
      name,
      data: {
        features: features.split(",").map((f) => f.trim()),
        price: Number(price),
        year: Number(year),
      },
    };

    try {
      const res = await fetch("https://api.restful-api.dev/objects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objectData),
      });

      const result = await res.json();
      console.log("Creado:", result);
      setResponse(result);
      localStorage.setItem("objectId", result.id);
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  const handleUpdate = async () => {
    const id = localStorage.getItem("objectId");
    if (!id) {
      alert("No hay ID guardado para actualizar.");
      return;
    }

    const updatedData = {
      data: {},
    };
    if (editPrice) updatedData.data.price = Number(editPrice);
    if (editFeatures) updatedData.data.features = editFeatures.split(",").map(f => f.trim());
    if (editName) updatedData.data.name = name(editName);
    if (editYear) updatedData.data.year = year(editYear);

    try {
      const res = await fetch(`https://api.restful-api.dev/objects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();
      console.log("Actualizado:", result);
      setResponse(result);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleDelete = async () => {
    const id = localStorage.getItem("objectId");
    if (!id) {
      alert("No hay ID guardado para eliminar.");
      return;
    }

    try {
      const res = await fetch(`https://api.restful-api.dev/objects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        console.log("Eliminado correctamente.");
        alert("Objeto eliminado correctamente.");
        localStorage.removeItem("objectId");
        setResponse(null);
      } else {
        console.error("Error al eliminar");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Crear Objeto</h2>
      <form onSubmit={handleCreate}>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required /><br />
        <input placeholder="Características (coma separadas)" value={features} onChange={(e) => setFeatures(e.target.value)} required /><br />
        <input type="number" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} required /><br />
        <input type="number" placeholder="Año" value={year} onChange={(e) => setYear(e.target.value)} required /><br />
        <button type="submit">Crear</button>
      </form>

      <h2>Editar Objeto</h2>
      <input placeholder="Nuevo Nombre" value={editName} onChange={(e) => setEditName(e.target.value)} /><br />
      <input placeholder="Nuevo Precio" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} /><br />
      <input placeholder="Nuevas Características" value={editFeatures} onChange={(e) => setEditFeatures(e.target.value)} /><br />
      <input placeholder="Nuevo Año del dispositivo" value={editYear} onChange={(e) => setEditYear(e.target.value)} /><br />

      <button onClick={handleUpdate}>Actualizar</button>

      <h2>Eliminar Objeto</h2>
      <button onClick={handleDelete}>Eliminar</button>

      <h3>Respuesta:</h3>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

export default ObjectManager;
