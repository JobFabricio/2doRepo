function Data() {
    // Agrega un nuevo documento a la colección "Usuarios" en la base de datos
    db.collection("Usuarios").add({
      Correo: document.getElementById("Correo").value,
      Contraseña: document.getElementById("Pass").value,
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
  