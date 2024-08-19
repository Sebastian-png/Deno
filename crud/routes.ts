import { Router } from "./deps.ts";
import { client } from "./config.ts";

const router = new Router();

router
  .get("/todos", async (context) => {
    const result = await client.query("SELECT * FROM todos");
    context.response.body = result;
  })
  .get("/todos/:id", async (context) => {
    const id = context.params.id;
    const result = await client.query("SELECT * FROM todos WHERE id = ?", [id]);
    context.response.body = result.length ? result[0] : { message: "No encontrado" };
  })
  router.post("/todos", async (context) => {
    try {
      // Obtén el cuerpo de la solicitud como JSON
      const body = await context.request.body({ type: "json" }).value;
      const { nombre, email } = body;
  
      // Verifica si el cuerpo de la solicitud tiene los datos correctos
      if (!nombre || !email) {
        context.response.status = 400;
        context.response.body = { message: "Nombre y email son requeridos" };
        return;
      }
  
      await client.execute("INSERT INTO todos(nombre, email) VALUES(?, ?)", [
        nombre,
        email,
      ]);
      context.response.status = 201;
      context.response.body = { message: "Todo creado exitosamente" };
    } catch (error) {
      console.error("Error al crear todo:", error);
      context.response.status = 500;
      context.response.body = { message: "Error interno del servidor" };
    }
  })
  router.put("/todos/:id", async (context) => {
    try {
      // Obtén el ID del parámetro de la URL
      const id = context.params.id;
  
      // Verifica si el cuerpo de la solicitud está presente
      if (!context.request.hasBody) {
        context.response.status = 400;
        context.response.body = { message: "El cuerpo de la solicitud no puede estar vacío" };
        return;
      }
  
      // Obtén el cuerpo de la solicitud como JSON
      const body = await context.request.body({ type: "json" }).value;
      const { nombre, email } = body;
  
      // Verifica si el cuerpo de la solicitud tiene los datos correctos
      if (!nombre || !email) {
        context.response.status = 400;
        context.response.body = { message: "Nombre y email son requeridos" };
        return;
      }
  
      // Verifica si el ID es un número válido
      if (isNaN(Number(id))) {
        context.response.status = 400;
        context.response.body = { message: "ID inválido" };
        return;
      }
  
      // Lógica para actualizar en la base de datos
      const result = await client.execute(
        "UPDATE todos SET nombre = ?, email = ? WHERE id = ?",
        [nombre, email, id]
      );
  
      // Verifica si se actualizó algún registro
      if (result.affectedRows === 0) {
        context.response.status = 404;
        context.response.body = { message: "Todo no encontrado" };
        return;
      }
  
      context.response.status = 200;
      context.response.body = { message: "Todo actualizado exitosamente" };
    } catch (error) {
      console.error("Error al actualizar todo:", error);
      context.response.status = 500;
      context.response.body = { message: "Error interno del servidor" };
    }
  })
  
  .delete("/todos/:id", async (context) => {
    const id = context.params.id;
    await client.execute("DELETE FROM todos WHERE id = ?", [id]);
    context.response.body = { message: "Todo eliminado exitosamente" };
  });

export default router;