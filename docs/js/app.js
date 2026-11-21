function leerDatos(clave) {
    try {
        const datos = JSON.parse(localStorage.getItem(clave));
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error("Error al leer " + clave, error);
        return [];
    }
}

function guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

function generarId(datos) {
    return datos.length
        ? Math.max(...datos.map(item => Number(item.id) || 0)) + 1
        : 1;
}

function limpiarCampos(ids) {
    ids.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.value = "";
    });
}

function mostrarElemento(id, visible) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.style.display = visible ? "block" : "none";
    }
}

// =====================================================
// NAVEGACIÓN
// =====================================================

function mostrar(id) {
    document.querySelectorAll(".pantalla").forEach(p => {
        p.classList.remove("activa");
    });

    const pantalla = document.getElementById(id);

    if (!pantalla) {
        console.error("No existe la pantalla: " + id);
        return;
    }

    pantalla.classList.add("activa");

    if (id === "productos") mostrarProductos();
    if (id === "lotes") mostrarLotes();
    if (id === "produccion") mostrarProducciones();
    if (id === "stock") mostrarStock();
    if (id === "ventas") mostrarVentas();
    if (id === "tareas") mostrarTareas();
    if (id === "vinedos") mostrarVinedos();
    if (id === "recepcion") mostrarRecepciones();
    if (id === "empleados") mostrarEmpleados();
    if (id === "reportes") mostrarReportes();

    const menu = document.querySelector(".menu-principal");

    if (menu) {
        if (
            id === "panel" ||
            id === "login" ||
            [
                "productos", "lotes", "produccion", "stock",
                "ventas", "tareas", "vinedos", "recepcion",
                "empleados", "reportes"
            ].includes(id)
        ) {
            menu.style.display = "none";
        } else {
            menu.style.display = "flex";
        }
    }
}

function login() {
    const usuario = document.getElementById("user").value.trim();
    const clave = document.getElementById("pass").value.trim();

    if (usuario !== "" && clave !== "") {
        mostrar("panel");
    } else {
        alert("Complete los campos.");
    }
}

function volver() {
    mostrar("panel");
}

function abrirModal() {
    mostrarElemento("modal", true);
    const modal = document.getElementById("modal");
    if (modal) modal.style.display = "flex";
}

function cerrarModal() {
    mostrarElemento("modal", false);
}

function cerrarSesion() {
    cerrarModal();
    mostrar("login");
}

// =====================================================
// PRODUCTOS
// =====================================================

let productos = leerDatos("sgb_productos");
let indiceEdicion = null;

function cargarProductos() {
    productos = leerDatos("sgb_productos");
    mostrarProductos();
}

function mostrarFormularioProducto() {
    mostrarElemento("formulario-producto", true);
}

function ocultarFormularioProducto() {
    mostrarElemento("formulario-producto", false);
    indiceEdicion = null;
}

function guardarProducto() {
    const nombre = document.getElementById("nombreProducto").value.trim();
    const tipo = document.getElementById("tipoProducto").value.trim();
    const anio = Number(document.getElementById("anioProducto").value);
    const stock = Number(document.getElementById("stockProducto").value);

    if (!nombre || !tipo ||
        document.getElementById("anioProducto").value === "" ||
        document.getElementById("stockProducto").value === "") {
        alert("Complete todos los campos.");
        return;
    }

    if (!Number.isInteger(stock) || stock < 0 ||
        !Number.isInteger(anio) || anio <= 0) {
        alert("Ingrese un año y un stock válidos.");
        return;
    }

    if (indiceEdicion !== null) {
        const producto = productos[indiceEdicion];

        productos[indiceEdicion] = {
            ...producto,
            nombre,
            tipo,
            anio,
            stock
        };

        alert("Producto actualizado correctamente.");
    } else {
        productos.push({
            id: generarId(productos),
            nombre,
            tipo,
            anio,
            stock
        });

        alert("Producto registrado correctamente.");
    }

    guardarDatos("sgb_productos", productos);
    cargarProductos();
    limpiarCampos([
        "nombreProducto", "tipoProducto",
        "anioProducto", "stockProducto"
    ]);
    ocultarFormularioProducto();
}

function mostrarProductos() {
    const tabla = document.getElementById("lista-productos");
    if (!tabla) return;

    tabla.innerHTML = "";

    const total = document.getElementById("totalProductos");
    const disponibles = document.getElementById("productosDisponibles");
    const sinStock = document.getElementById("productosSinStock");

    if (total) total.textContent = productos.length;
    if (disponibles) {
        disponibles.textContent =
            productos.filter(p => Number(p.stock) > 0).length;
    }
    if (sinStock) {
        sinStock.textContent =
            productos.filter(p => Number(p.stock) === 0).length;
    }

    productos.forEach((producto, indice) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.tipo}</td>
            <td>${producto.anio}</td>
            <td>${producto.stock}</td>
            <td>${Number(producto.stock) > 0 ? "Disponible" : "Sin stock"}</td>
            <td>
                <button onclick="editarProducto(${indice})">Editar</button>
                <button onclick="eliminarProducto(${indice})">Eliminar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

function editarProducto(indice) {
    const producto = productos[indice];
    if (!producto) return;

    document.getElementById("nombreProducto").value = producto.nombre;
    document.getElementById("tipoProducto").value = producto.tipo;
    document.getElementById("anioProducto").value = producto.anio;
    document.getElementById("stockProducto").value = producto.stock;

    indiceEdicion = indice;
    mostrarFormularioProducto();
}

function eliminarProducto(indice) {
    const producto = productos[indice];
    if (!producto) return;

    if (!confirm(`¿Desea eliminar el producto ${producto.nombre}?`)) return;

    productos.splice(indice, 1);
    guardarDatos("sgb_productos", productos);
    cargarProductos();

    alert("Producto eliminado correctamente.");
}

// =====================================================
// LOTES
// =====================================================

let lotes = leerDatos("sgb_lotes");
let indiceEdicionLote = null;

function cargarLotes() {
    lotes = leerDatos("sgb_lotes");
    mostrarLotes();
}

function mostrarFormularioLote() {
    mostrarElemento("formulario-lote", true);
}

function ocultarFormularioLote() {
    mostrarElemento("formulario-lote", false);
    indiceEdicionLote = null;
}

function guardarLote() {
    const numero = document.getElementById("numeroLote").value.trim();
    const fecha = document.getElementById("fechaLote").value;
    const estado = document.getElementById("estadoLote").value;

    if (!numero || !fecha || !estado) {
        alert("Complete todos los campos.");
        return;
    }

    if (indiceEdicionLote !== null) {
        lotes[indiceEdicionLote] = {
            ...lotes[indiceEdicionLote],
            numero, fecha, estado
        };
        alert("Lote actualizado correctamente.");
    } else {
        lotes.push({
            id: generarId(lotes),
            numero, fecha, estado
        });
        alert("Lote registrado correctamente.");
    }

    guardarDatos("sgb_lotes", lotes);
    cargarLotes();
    limpiarCampos(["numeroLote", "fechaLote", "estadoLote"]);
    ocultarFormularioLote();
}

function mostrarLotes() {
    const contenedor = document.getElementById("lista-lotes");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    lotes.forEach((lote, indice) => {
        contenedor.innerHTML += `
            <div class="card">
                <h3>Lote ${lote.numero}</h3>
                <p>Fecha: ${lote.fecha}</p>
                <p>Estado: ${lote.estado}</p>
                <button onclick="editarLote(${indice})">Editar</button>
                <button onclick="eliminarLote(${indice})">Eliminar</button>
            </div>
        `;
    });
}

function editarLote(indice) {
    const lote = lotes[indice];
    if (!lote) return;

    document.getElementById("numeroLote").value = lote.numero;
    document.getElementById("fechaLote").value = lote.fecha;
    document.getElementById("estadoLote").value = lote.estado;

    indiceEdicionLote = indice;
    mostrarFormularioLote();
}

function eliminarLote(indice) {
    const lote = lotes[indice];
    if (!lote || !confirm(`¿Eliminar el lote ${lote.numero}?`)) return;

    lotes.splice(indice, 1);
    guardarDatos("sgb_lotes", lotes);
    cargarLotes();

    alert("Lote eliminado correctamente.");
}

// =====================================================
// PRODUCCIÓN
// =====================================================

let producciones = leerDatos("sgb_producciones");
let indiceEdicionProduccion = null;

function cargarProducciones() {
    producciones = leerDatos("sgb_producciones");
    mostrarProducciones();
}

function mostrarFormularioProduccion() {
    mostrarElemento("formulario-produccion", true);
}

function ocultarFormularioProduccion() {
    mostrarElemento("formulario-produccion", false);
    indiceEdicionProduccion = null;
}

function guardarProduccion() {
    const producto = document.getElementById("productoProduccion").value.trim();
    const cantidad = Number(document.getElementById("cantidadProduccion").value);
    const fecha = document.getElementById("fechaProduccion").value;
    const estado = document.getElementById("estadoProduccion").value;

    if (!producto || !Number.isFinite(cantidad) ||
        cantidad <= 0 || !fecha || !estado) {
        alert("Complete correctamente todos los campos.");
        return;
    }

    if (indiceEdicionProduccion !== null) {
        producciones[indiceEdicionProduccion] = {
            ...producciones[indiceEdicionProduccion],
            producto, cantidad, fecha, estado
        };
        alert("Producción actualizada correctamente.");
    } else {
        producciones.push({
            id: generarId(producciones),
            producto, cantidad, fecha, estado
        });
        alert("Producción registrada correctamente.");
    }

    guardarDatos("sgb_producciones", producciones);
    cargarProducciones();
    limpiarCampos([
        "productoProduccion", "cantidadProduccion",
        "fechaProduccion", "estadoProduccion"
    ]);
    ocultarFormularioProduccion();
}

function mostrarProducciones() {
    const tabla = document.getElementById("lista-produccion");
    if (!tabla) return;

    tabla.innerHTML = "";

    const total = document.getElementById("totalProducciones");
    const activas = document.getElementById("produccionesActivas");
    const finalizadas = document.getElementById("produccionesFinalizadas");

    if (total) total.textContent = producciones.length;
    if (activas) {
        activas.textContent =
            producciones.filter(p => p.estado !== "Finalizado").length;
    }
    if (finalizadas) {
        finalizadas.textContent =
            producciones.filter(p => p.estado === "Finalizado").length;
    }

    producciones.forEach((p, indice) => {
        tabla.innerHTML += `
            <tr>
                <td>${p.producto}</td>
                <td>${p.cantidad}</td>
                <td>${p.fecha}</td>
                <td>${p.estado}</td>
                <td>
                    <button onclick="editarProduccion(${indice})">Editar</button>
                    <button onclick="eliminarProduccion(${indice})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function editarProduccion(indice) {
    const p = producciones[indice];
    if (!p) return;

    document.getElementById("productoProduccion").value = p.producto;
    document.getElementById("cantidadProduccion").value = p.cantidad;
    document.getElementById("fechaProduccion").value = p.fecha;
    document.getElementById("estadoProduccion").value = p.estado;

    indiceEdicionProduccion = indice;
    mostrarFormularioProduccion();
}

function eliminarProduccion(indice) {
    if (!producciones[indice] ||
        !confirm("¿Desea eliminar esta producción?")) return;

    producciones.splice(indice, 1);
    guardarDatos("sgb_producciones", producciones);
    cargarProducciones();

    alert("Producción eliminada correctamente.");
}

// =====================================================
// STOCK
// =====================================================

function mostrarStock() {
    const tabla = document.getElementById("lista-stock");
    if (!tabla) return;

    tabla.innerHTML = "";

    const unidades = productos.reduce(
        (total, p) => total + Number(p.stock), 0
    );

    const total = document.getElementById("totalStock");
    const disponible = document.getElementById("stockDisponible");
    const bajo = document.getElementById("stockBajo");

    if (total) total.textContent = productos.length;
    if (disponible) disponible.textContent = unidades;
    if (bajo) {
        bajo.textContent =
            productos.filter(p => Number(p.stock) === 0).length;
    }

    productos.forEach((producto, indice) => {
        tabla.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.tipo}</td>
                <td>${producto.stock}</td>
                <td>${Number(producto.stock) > 0 ? "Disponible" : "Sin stock"}</td>
                <td>
                    <button onclick="modificarStock(${indice})">Modificar</button>
                </td>
            </tr>
        `;
    });
}

function modificarStock(indice) {
    const producto = productos[indice];
    if (!producto) return;

    const cantidad = prompt(
        `Ingrese el nuevo stock de ${producto.nombre}:`,
        producto.stock
    );

    if (cantidad === null || cantidad.trim() === "") return;

    const nuevoStock = Number(cantidad);

    if (!Number.isInteger(nuevoStock) || nuevoStock < 0) {
        alert("Ingrese una cantidad entera válida.");
        return;
    }

    producto.stock = nuevoStock;

    guardarDatos("sgb_productos", productos);
    cargarProductos();
    mostrarStock();

    alert("Stock actualizado correctamente.");
}

// =====================================================
// VENTAS
// =====================================================

let ventas = leerDatos("sgb_ventas");

function cargarVentas() {
    ventas = leerDatos("sgb_ventas");
    mostrarVentas();
}

function mostrarFormularioVenta() {
    const selector = document.getElementById("productoVenta");
    if (!selector) return;

    selector.innerHTML =
        '<option value="">Seleccione un producto</option>';

    productos.forEach(producto => {
        const opcion = document.createElement("option");
        opcion.value = producto.id;
        opcion.textContent =
            `${producto.nombre} - Stock: ${producto.stock}`;
        selector.appendChild(opcion);
    });

    if (productos.length === 0) {
        alert("Primero debe registrar productos.");
        return;
    }

    mostrarElemento("formulario-venta", true);
}

function ocultarFormularioVenta() {
    mostrarElemento("formulario-venta", false);
}

function guardarVenta() {
    const cliente = document.getElementById("clienteVenta").value.trim();
    const productoId = document.getElementById("productoVenta").value;
    const cantidad = Number(document.getElementById("cantidadVenta").value);
    const precio = Number(document.getElementById("precioVenta").value);

    if (!cliente || !productoId || !Number.isInteger(cantidad) ||
        cantidad <= 0 || !Number.isFinite(precio) || precio <= 0) {
        alert("Complete correctamente todos los campos.");
        return;
    }

    const producto = productos.find(
        p => String(p.id) === String(productoId)
    );

    if (!producto) {
        alert("Seleccione un producto válido.");
        return;
    }

    if (cantidad > Number(producto.stock)) {
        alert("Stock insuficiente.");
        return;
    }

    producto.stock = Number(producto.stock) - cantidad;

    const venta = {
        id: generarId(ventas),
        cliente,
        producto: producto.nombre,
        producto_id: producto.id,
        cantidad,
        precio,
        total: cantidad * precio,
        fecha: new Date().toLocaleDateString("en-CA")
    };

    ventas.push(venta);

    guardarDatos("sgb_productos", productos);
    guardarDatos("sgb_ventas", ventas);

    cargarProductos();
    cargarVentas();
    mostrarStock();
    ocultarFormularioVenta();

    limpiarCampos([
        "clienteVenta", "productoVenta",
        "cantidadVenta", "precioVenta"
    ]);

    alert("Venta registrada correctamente.");
}

function mostrarVentas() {
    const tabla = document.getElementById("lista-ventas");
    if (!tabla) return;

    tabla.innerHTML = "";

    const totalVentas = document.getElementById("totalVentas");
    const dineroVentas = document.getElementById("dineroVentas");
    const productosVendidos = document.getElementById("productosVendidos");

    if (totalVentas) totalVentas.textContent = ventas.length;

    const dinero = ventas.reduce(
        (total, venta) => total + Number(venta.total), 0
    );

    if (dineroVentas) {
        dineroVentas.textContent = "$" + dinero.toLocaleString("es-AR");
    }

    if (productosVendidos) {
        productosVendidos.textContent =
            ventas.reduce((total, venta) => total + Number(venta.cantidad), 0);
    }

    ventas.forEach(venta => {
        tabla.innerHTML += `
            <tr>
                <td>${venta.cliente}</td>
                <td>${venta.producto}</td>
                <td>${venta.cantidad}</td>
                <td>$${Number(venta.total).toLocaleString("es-AR")}</td>
                <td>${venta.fecha}</td>
                <td>
                    <button onclick="eliminarVenta(${venta.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function eliminarVenta(id) {
    const venta = ventas.find(v => Number(v.id) === Number(id));
    if (!venta) return;

    if (!confirm("¿Eliminar esta venta y devolver el stock?")) return;

    const producto = productos.find(
        p => Number(p.id) === Number(venta.producto_id)
    );

    if (producto) {
        producto.stock = Number(producto.stock) + Number(venta.cantidad);
    }

    ventas = ventas.filter(v => Number(v.id) !== Number(id));

    guardarDatos("sgb_productos", productos);
    guardarDatos("sgb_ventas", ventas);

    cargarProductos();
    cargarVentas();
    mostrarStock();

    alert("Venta eliminada y stock restablecido.");
}

// =====================================================
// TAREAS
// =====================================================

let tareas = leerDatos("sgb_tareas");
let indiceEdicionTarea = null;

function cargarTareas() {
    tareas = leerDatos("sgb_tareas");
    mostrarTareas();
}

function mostrarFormularioTarea() {
    mostrarElemento("formulario-tarea", true);
}

function ocultarFormularioTarea() {
    mostrarElemento("formulario-tarea", false);
    indiceEdicionTarea = null;
}

function guardarTarea() {
    const descripcion = document.getElementById("descripcionTarea").value.trim();
    const responsable = document.getElementById("responsableTarea").value.trim();
    const fecha = document.getElementById("fechaTarea").value;
    const estado = document.getElementById("estadoTarea").value;

    if (!descripcion || !responsable || !fecha || !estado) {
        alert("Complete todos los campos.");
        return;
    }

    if (indiceEdicionTarea !== null) {
        tareas[indiceEdicionTarea] = {
            ...tareas[indiceEdicionTarea],
            descripcion, responsable, fecha, estado
        };
    } else {
        tareas.push({
            id: generarId(tareas),
            descripcion, responsable, fecha, estado
        });
    }

    guardarDatos("sgb_tareas", tareas);
    cargarTareas();
    limpiarCampos([
        "descripcionTarea", "responsableTarea",
        "fechaTarea", "estadoTarea"
    ]);
    ocultarFormularioTarea();

    alert("Tarea guardada correctamente.");
}

function mostrarTareas() {
    const tabla = document.getElementById("lista-tareas");
    if (!tabla) return;

    tabla.innerHTML = "";

    const total = document.getElementById("totalTareas");
    const pendientes = document.getElementById("tareasPendientes");
    const completadas = document.getElementById("tareasCompletadas");

    if (total) total.textContent = tareas.length;
    if (pendientes) {
        pendientes.textContent =
            tareas.filter(t => t.estado !== "Completada").length;
    }
    if (completadas) {
        completadas.textContent =
            tareas.filter(t => t.estado === "Completada").length;
    }

    tareas.forEach((tarea, indice) => {
        tabla.innerHTML += `
            <tr>
                <td>${tarea.descripcion}</td>
                <td>${tarea.responsable}</td>
                <td>${tarea.fecha}</td>
                <td>${tarea.estado}</td>
                <td>
                    <button onclick="editarTarea(${indice})">Editar</button>
                    <button onclick="completarTarea(${indice})">Completar</button>
                    <button onclick="eliminarTarea(${indice})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function editarTarea(indice) {
    const tarea = tareas[indice];
    if (!tarea) return;

    indiceEdicionTarea = indice;

    document.getElementById("descripcionTarea").value = tarea.descripcion;
    document.getElementById("responsableTarea").value = tarea.responsable;
    document.getElementById("fechaTarea").value = tarea.fecha;
    document.getElementById("estadoTarea").value = tarea.estado;

    mostrarFormularioTarea();
}

function completarTarea(indice) {
    const tarea = tareas[indice];
    if (!tarea) return;

    tarea.estado = "Completada";

    guardarDatos("sgb_tareas", tareas);
    cargarTareas();

    alert("Tarea completada.");
}

function eliminarTarea(indice) {
    if (!tareas[indice] || !confirm("¿Eliminar esta tarea?")) return;

    tareas.splice(indice, 1);
    guardarDatos("sgb_tareas", tareas);
    cargarTareas();

    alert("Tarea eliminada.");
}

// =====================================================
// VIÑEDOS
// =====================================================

let vinedos = leerDatos("sgb_vinedos");
let indiceEdicionVinedo = null;

function cargarVinedos() {
    vinedos = leerDatos("sgb_vinedos");
    mostrarVinedos();
}

function mostrarFormularioVinedo() {
    mostrarElemento("formulario-vinedo", true);
}

function ocultarFormularioVinedo() {
    mostrarElemento("formulario-vinedo", false);
    indiceEdicionVinedo = null;
}

function limpiarFormularioVinedo() {
    limpiarCampos([
        "nombreVinedo", "variedadVinedo",
        "superficieVinedo", "estadoVinedo",
        "rendimientoVinedo"
    ]);
    indiceEdicionVinedo = null;
}

function guardarVinedo() {
    const datos = {
        nombre: document.getElementById("nombreVinedo").value.trim(),
        variedad: document.getElementById("variedadVinedo").value.trim(),
        superficie: Number(document.getElementById("superficieVinedo").value),
        estado: document.getElementById("estadoVinedo").value,
        rendimiento: Number(document.getElementById("rendimientoVinedo").value)
    };

    if (!datos.nombre || !datos.variedad || !datos.estado ||
        !Number.isFinite(datos.superficie) || datos.superficie <= 0 ||
        !Number.isFinite(datos.rendimiento) || datos.rendimiento < 0) {
        alert("Complete los campos con valores válidos.");
        return;
    }

    if (indiceEdicionVinedo !== null) {
        vinedos[indiceEdicionVinedo] = {
            ...vinedos[indiceEdicionVinedo],
            ...datos
        };
    } else {
        vinedos.push({
            id: generarId(vinedos),
            ...datos
        });
    }

    guardarDatos("sgb_vinedos", vinedos);
    cargarVinedos();
    limpiarFormularioVinedo();
    ocultarFormularioVinedo();

    alert("Viñedo guardado correctamente.");
}

function mostrarVinedos() {
    const lista = document.getElementById("lista-vinedos");
    if (!lista) return;

    lista.innerHTML = "";

    const total = document.getElementById("totalVinedos");
    const activos = document.getElementById("vinedosActivos");
    const superficie = document.getElementById("superficieTotal");

    if (total) total.textContent = vinedos.length;
    if (activos) {
        activos.textContent =
            vinedos.filter(v => v.estado === "Activo").length;
    }
    if (superficie) {
        superficie.textContent =
            vinedos.reduce((suma, v) => suma + Number(v.superficie), 0);
    }

    vinedos.forEach((vinedo, indice) => {
        lista.innerHTML += `
            <div class="tarjeta">
                <h3>${vinedo.nombre}</h3>
                <p>Variedad: ${vinedo.variedad}</p>
                <p>Superficie: ${vinedo.superficie}</p>
                <p>Estado: ${vinedo.estado}</p>
                <p>Rendimiento: ${vinedo.rendimiento}</p>
                <button onclick="editarVinedo(${indice})">Editar</button>
                <button onclick="eliminarVinedo(${indice})">Eliminar</button>
            </div>
        `;
    });
}

function editarVinedo(indice) {
    const vinedo = vinedos[indice];
    if (!vinedo) return;

    indiceEdicionVinedo = indice;

    document.getElementById("nombreVinedo").value = vinedo.nombre;
    document.getElementById("variedadVinedo").value = vinedo.variedad;
    document.getElementById("superficieVinedo").value = vinedo.superficie;
    document.getElementById("estadoVinedo").value = vinedo.estado;
    document.getElementById("rendimientoVinedo").value = vinedo.rendimiento;

    mostrarFormularioVinedo();
}

function eliminarVinedo(indice) {
    if (!vinedos[indice] ||
        !confirm("¿Está seguro de eliminar este viñedo?")) return;

    vinedos.splice(indice, 1);
    guardarDatos("sgb_vinedos", vinedos);
    cargarVinedos();

    alert("Viñedo eliminado correctamente.");
}

// =====================================================
// RECEPCIÓN DE UVA
// =====================================================

let recepciones = leerDatos("sgb_recepciones");
let indiceEdicionRecepcion = null;

function cargarRecepciones() {
    recepciones = leerDatos("sgb_recepciones");
    mostrarRecepciones();
}

function mostrarFormularioRecepcion() {
    mostrarElemento("formulario-recepcion", true);
}

function ocultarFormularioRecepcion() {
    mostrarElemento("formulario-recepcion", false);
    indiceEdicionRecepcion = null;
}

function limpiarFormularioRecepcion() {
    limpiarCampos([
        "proveedorUva", "variedadUva", "cantidadUva",
        "fechaUva", "observacionesUva"
    ]);
    indiceEdicionRecepcion = null;
}

function guardarRecepcion() {
    const datos = {
        proveedor: document.getElementById("proveedorUva").value.trim(),
        variedad: document.getElementById("variedadUva").value.trim(),
        cantidad: Number(document.getElementById("cantidadUva").value),
        fecha: document.getElementById("fechaUva").value,
        observaciones: document.getElementById("observacionesUva").value.trim()
    };

    if (!datos.proveedor || !datos.variedad || !datos.fecha ||
        !Number.isFinite(datos.cantidad) || datos.cantidad <= 0) {
        alert("Complete los campos obligatorios con datos válidos.");
        return;
    }

    if (indiceEdicionRecepcion !== null) {
        recepciones[indiceEdicionRecepcion] = {
            ...recepciones[indiceEdicionRecepcion],
            ...datos
        };
    } else {
        recepciones.push({
            id: generarId(recepciones),
            ...datos
        });
    }

    guardarDatos("sgb_recepciones", recepciones);
    cargarRecepciones();
    limpiarFormularioRecepcion();
    ocultarFormularioRecepcion();

    alert("Recepción guardada correctamente.");
}

function mostrarRecepciones() {
    const lista = document.getElementById("lista-recepcion");
    if (!lista) return;

    lista.innerHTML = "";

    const totalUva = document.getElementById("totalUva");
    const totalRecepciones = document.getElementById("totalRecepciones");
    const proveedores = document.getElementById("proveedoresActivos");

    if (totalUva) {
        totalUva.textContent =
            recepciones.reduce((total, r) => total + Number(r.cantidad), 0);
    }
    if (totalRecepciones) totalRecepciones.textContent = recepciones.length;
    if (proveedores) {
        proveedores.textContent =
            new Set(recepciones.map(r => r.proveedor)).size;
    }

    recepciones.forEach((recepcion, indice) => {
        lista.innerHTML += `
            <tr>
                <td>${recepcion.proveedor}</td>
                <td>${recepcion.variedad}</td>
                <td>${recepcion.cantidad}</td>
                <td>${recepcion.fecha}</td>
                <td>${recepcion.observaciones || ""}</td>
                <td>
                    <button onclick="editarRecepcion(${indice})">Editar</button>
                    <button onclick="eliminarRecepcion(${indice})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function editarRecepcion(indice) {
    const r = recepciones[indice];
    if (!r) return;

    indiceEdicionRecepcion = indice;

    document.getElementById("proveedorUva").value = r.proveedor;
    document.getElementById("variedadUva").value = r.variedad;
    document.getElementById("cantidadUva").value = r.cantidad;
    document.getElementById("fechaUva").value = r.fecha;
    document.getElementById("observacionesUva").value = r.observaciones || "";

    mostrarFormularioRecepcion();
}

function eliminarRecepcion(indice) {
    if (!recepciones[indice] ||
        !confirm("¿Eliminar esta recepción?")) return;

    recepciones.splice(indice, 1);
    guardarDatos("sgb_recepciones", recepciones);
    cargarRecepciones();

    alert("Recepción eliminada correctamente.");
}

// =====================================================
// EMPLEADOS Y ASISTENCIAS
// =====================================================

let empleados = leerDatos("sgb_empleados");
let asistencias = leerDatos("sgb_asistencias");
let indiceEdicionEmpleado = null;

function cargarEmpleados() {
    empleados = leerDatos("sgb_empleados");
    asistencias = leerDatos("sgb_asistencias");

    empleados = empleados.map(empleado => ({
        ...empleado,
        asistencias: asistencias
            .filter(a => Number(a.empleado_id) === Number(empleado.id))
            .map(a => a.fecha)
    }));

    mostrarEmpleados();
}

function mostrarFormularioEmpleado() {
    mostrarElemento("formulario-empleado", true);
}

function ocultarFormularioEmpleado() {
    mostrarElemento("formulario-empleado", false);
    indiceEdicionEmpleado = null;
}

function limpiarFormularioEmpleado() {
    limpiarCampos([
        "nombreEmpleado", "puestoEmpleado",
        "telefonoEmpleado", "correoEmpleado"
    ]);
    indiceEdicionEmpleado = null;
}

function guardarEmpleado() {
    const datos = {
        nombre: document.getElementById("nombreEmpleado").value.trim(),
        puesto: document.getElementById("puestoEmpleado").value.trim(),
        telefono: document.getElementById("telefonoEmpleado").value.trim(),
        correo: document.getElementById("correoEmpleado").value.trim()
    };

    if (!datos.nombre || !datos.puesto) {
        alert("El nombre y el puesto son obligatorios.");
        return;
    }

    if (indiceEdicionEmpleado !== null) {
        empleados[indiceEdicionEmpleado] = {
            ...empleados[indiceEdicionEmpleado],
            ...datos
        };
    } else {
        empleados.push({
            id: generarId(empleados),
            ...datos
        });
    }

    guardarDatos("sgb_empleados", empleados);
    cargarEmpleados();
    limpiarFormularioEmpleado();
    ocultarFormularioEmpleado();

    alert("Empleado guardado correctamente.");
}

function mostrarEmpleados() {
    const lista = document.getElementById("lista-empleados");
    if (!lista) return;

    lista.innerHTML = "";

    const total = document.getElementById("totalEmpleados");
    const asistenciasHoy = document.getElementById("asistenciasHoy");

    if (total) total.textContent = empleados.length;

    const hoy = new Date().toLocaleDateString("en-CA");

    const presentes = asistencias.filter(a => a.fecha === hoy).length;

    if (asistenciasHoy) asistenciasHoy.textContent = presentes;

    empleados.forEach((empleado, indice) => {
        lista.innerHTML += `
            <div class="tarjeta">
                <h3>${empleado.nombre}</h3>
                <p>Puesto: ${empleado.puesto}</p>
                <p>Teléfono: ${empleado.telefono || "No informado"}</p>
                <p>Correo: ${empleado.correo || "No informado"}</p>
                <p>Asistencias: ${empleado.asistencias.length}</p>

                <button onclick="editarEmpleado(${indice})">Editar</button>
                <button onclick="registrarAsistencia(${indice})">Registrar asistencia</button>
                <button onclick="asignarTareaEmpleado(${indice})">Asignar tarea</button>
                <button onclick="eliminarEmpleado(${indice})">Eliminar</button>
            </div>
        `;
    });
}

function editarEmpleado(indice) {
    const empleado = empleados[indice];
    if (!empleado) return;

    indiceEdicionEmpleado = indice;

    document.getElementById("nombreEmpleado").value = empleado.nombre;
    document.getElementById("puestoEmpleado").value = empleado.puesto;
    document.getElementById("telefonoEmpleado").value = empleado.telefono || "";
    document.getElementById("correoEmpleado").value = empleado.correo || "";

    mostrarFormularioEmpleado();
}

function registrarAsistencia(indice) {
    const empleado = empleados[indice];
    if (!empleado) return;

    const hoy = new Date().toLocaleDateString("en-CA");

    const yaRegistrada = asistencias.some(
        a => Number(a.empleado_id) === Number(empleado.id) &&
             a.fecha === hoy
    );

    if (yaRegistrada) {
        alert("La asistencia de hoy ya está registrada.");
        return;
    }

    asistencias.push({
        id: generarId(asistencias),
        empleado_id: empleado.id,
        fecha: hoy
    });

    guardarDatos("sgb_asistencias", asistencias);
    cargarEmpleados();

    alert("Asistencia registrada correctamente.");
}

function eliminarEmpleado(indice) {
    const empleado = empleados[indice];
    if (!empleado || !confirm("¿Eliminar este empleado?")) return;

    empleados.splice(indice, 1);

    asistencias = asistencias.filter(
        a => Number(a.empleado_id) !== Number(empleado.id)
    );

    guardarDatos("sgb_empleados", empleados);
    guardarDatos("sgb_asistencias", asistencias);

    cargarEmpleados();

    alert("Empleado eliminado correctamente.");
}

function asignarTareaEmpleado(indice) {
    const empleado = empleados[indice];
    if (!empleado) return;

    mostrar("tareas");

    document.getElementById("responsableTarea").value = empleado.nombre;
    mostrarFormularioTarea();
}

// =====================================================
// REPORTES
// =====================================================

function mostrarReportes() {
    const totalProductos = productos.length;

    const totalStock = productos.reduce(
        (total, p) => total + Number(p.stock || 0), 0
    );

    const totalProduccion = producciones.reduce(
        (total, p) => total + Number(p.cantidad || 0), 0
    );

    const totalVentas = ventas.reduce(
        (total, v) => total + Number(v.total || 0), 0
    );

    const totalUva = recepciones.reduce(
        (total, r) => total + Number(r.cantidad || 0), 0
    );

    const tareasCompletadas = tareas.filter(
        t => t.estado === "Completada"
    ).length;

    const valores = {
        reporteProductos: totalProductos,
        reporteStock: totalStock,
        reporteProduccion: totalProduccion,
        reporteVentas: "$" + totalVentas.toLocaleString("es-AR"),
        reporteUvas: totalUva,
        reporteTareas: tareasCompletadas
    };

    Object.entries(valores).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });

    const resumen = {};

    producciones.forEach(p => {
        const nombre = p.producto || "Sin especificar";
        resumen[nombre] = (resumen[nombre] || 0) + Number(p.cantidad || 0);
    });

    const tabla = document.getElementById("lista-reporte-produccion");

    if (tabla) {
        tabla.innerHTML = "";

        Object.entries(resumen).forEach(([producto, cantidad]) => {
            tabla.innerHTML += `
                <tr>
                    <td>${producto}</td>
                    <td>${cantidad}</td>
                </tr>
            `;
        });
    }
}

// =====================================================
// EXPORTAR REPORTE PDF
// =====================================================

function generarReportePDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("Error: la biblioteca jsPDF no se cargó.");
        return;
    }

    mostrarReportes();

    const jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Reporte del Sistema de Gestion de Bodega", 15, 20);

    pdf.setFontSize(12);
    pdf.text(
        "Fecha: " + new Date().toLocaleDateString("es-AR"),
        15, 30
    );

    const datos = [
        ["Productos registrados", "reporteProductos"],
        ["Unidades en stock", "reporteStock"],
        ["Litros producidos", "reporteProduccion"],
        ["Total de ventas", "reporteVentas"],
        ["Kg de uvas recibidos", "reporteUvas"],
        ["Tareas completadas", "reporteTareas"]
    ];

    let y = 45;

    datos.forEach(([titulo, id]) => {
        const elemento = document.getElementById(id);

        if (elemento) {
            pdf.text(titulo + ": " + elemento.textContent, 15, y);
            y += 12;
        }
    });

    pdf.save("Reporte_SGB.pdf");
}

// =====================================================
// INICIALIZACIÓN
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    cargarLotes();
    cargarProducciones();
    cargarVentas();
    cargarTareas();
    cargarVinedos();
    cargarRecepciones();
    cargarEmpleados();

    mostrarReportes();

    console.log("Sistema SGB iniciado correctamente.");
});

function enviarConsulta(event) {
    console.log("Se ejecutó enviarConsulta");
    event.preventDefault();

    const nombre = document.getElementById("contactoNombre").value.trim();
    const correo = document.getElementById("contactoCorreo").value.trim();
    const mensaje = document.getElementById("contactoMensaje").value.trim();

    if (!nombre || !correo || !mensaje) {
        alert("Por favor, completá todos los campos.");
        return;
    }

    document.getElementById("mensajeContacto").textContent =
        "¡Gracias por comunicarte con nosotros! Tu consulta fue registrada correctamente.";

    event.target.reset();
}
