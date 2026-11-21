
import unicodedata


def normalizar(texto):
    texto = texto.lower().strip()
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(
        caracter for caracter in texto
        if unicodedata.category(caracter) != "Mn"
    )
    return " ".join(texto.split())


MENU = (
    "🍇 ASISTENTE VIRTUAL SGB\n\n"
    "¿Qué módulo querés consultar?\n\n"
    "1. ¿Qué es el SGB?\n"
    "2. Productos\n"
    "3. Stock\n"
    "4. Producción\n"
    "5. Ventas\n"
    "6. Recepción de uvas\n"
    "7. Tareas\n"
    "8. Lotes\n"
    "9. Viñedos\n"
    "10. Empleados y asistencias\n"
    "11. Reportes\n\n"
    "Escribí el número o el nombre del módulo."
)


MODULOS = {
    "sgb": {
        "nombre": "Sistema de Gestión de Bodega",
        "alias": ["1", "sgb", "sistema", "sistema de gestion de bodega"],
        "descripcion": (
            "🍇 SISTEMA DE GESTIÓN DE BODEGA\n\n"
            "Es una aplicación para organizar la información y "
            "las actividades de una bodega.\n\n"
            "Incluye gestión de productos, stock, producción, ventas, "
            "recepción de uvas, tareas, lotes, viñedos, empleados, "
            "asistencias y reportes."
        ),
        "campos": "El sistema trabaja con distintos datos según el módulo: productos, cantidades, fechas, estados, clientes, proveedores y responsables, entre otros.",
        "registro": "Cada módulo tiene un formulario para ingresar los datos correspondientes y guardarlos en el sistema.",
        "edicion": "Los registros de los módulos pueden modificarse cuando la aplicación ofrece la opción de editar.",
        "eliminacion": "Los registros pueden eliminarse desde las opciones correspondientes de cada módulo.",
        "consulta": "El sistema permite consultar los registros guardados y visualizar información organizada por módulo."
    },

    "productos": {
        "nombre": "Productos",
        "alias": ["2", "producto", "productos"],
        "descripcion": (
            "📦 GESTIÓN DE PRODUCTOS\n\n"
            "Este módulo permite registrar, consultar, editar y eliminar "
            "productos de la bodega. También permite controlar el stock "
            "de cada producto."
        ),
        "campos": "Para registrar un producto se utilizan estos datos:\n• Nombre\n• Tipo\n• Año de elaboración\n• Stock inicial",
        "registro": "Para registrar un producto, completá nombre, tipo, año de elaboración y stock inicial. Después guardá el formulario.",
        "edicion": "Sí. Se puede seleccionar un producto, modificar sus datos y guardar los cambios.",
        "eliminacion": "Sí. El sistema permite eliminar un producto por su identificador. Si el producto no existe, la API devuelve un mensaje de error.",
        "consulta": "Se pueden consultar los productos registrados y ver su nombre, tipo, año y stock. También se muestra si está disponible o sin stock."
    },

    "stock": {
        "nombre": "Stock",
        "alias": ["3", "stock", "existencias", "inventario"],
        "descripcion": (
            "📊 CONTROL DE STOCK\n\n"
            "Este módulo permite consultar las existencias de los productos "
            "y conocer las cantidades disponibles."
        ),
        "campos": "El stock se obtiene de la cantidad registrada en cada producto. Se muestra el nombre, tipo, cantidad disponible y estado.",
        "registro": "El stock inicial se carga al registrar un producto. Luego se puede modificar desde la gestión de productos.",
        "edicion": "Sí. Se puede actualizar la cantidad de stock modificando el dato correspondiente del producto. La cantidad debe ser un número entero igual o mayor que cero.",
        "eliminacion": "El stock no se elimina como un registro independiente. Se administra desde los productos y también se actualiza con las ventas.",
        "consulta": "Se puede consultar la cantidad de cada producto, el total de unidades y los productos que están sin stock."
    },

    "produccion": {
        "nombre": "Producción",
        "alias": ["4", "produccion", "producciones"],
        "descripcion": (
            "🏭 GESTIÓN DE PRODUCCIÓN\n\n"
            "Permite registrar y hacer seguimiento de los procesos "
            "de producción de la bodega."
        ),
        "campos": "Cada registro de producción contiene:\n• Producto\n• Cantidad producida\n• Fecha\n• Estado del proceso",
        "registro": "Para registrar una producción, ingresá el producto, la cantidad, la fecha y el estado. La cantidad debe ser mayor que cero.",
        "edicion": "Sí. Se puede modificar el producto, la cantidad, la fecha y el estado de una producción.",
        "eliminacion": "Sí. La API permite eliminar un registro de producción.",
        "consulta": "Se pueden consultar las producciones registradas y visualizar sus datos y estados. El sistema también muestra cantidades de producciones y estados de los procesos."
    },

    "ventas": {
        "nombre": "Ventas",
        "alias": ["5", "venta", "ventas"],
        "descripcion": (
            "💰 GESTIÓN DE VENTAS\n\n"
            "Permite registrar ventas de productos, consultar operaciones "
            "y controlar el efecto de las ventas sobre el stock."
        ),
        "campos": "Cada venta registra:\n• Cliente\n• Producto\n• Cantidad\n• Precio unitario\n• Fecha\n\nEl sistema calcula el total multiplicando cantidad por precio.",
        "registro": "Para registrar una venta, ingresá el cliente, seleccioná un producto, indicá la cantidad, el precio y la fecha. La cantidad y el precio deben ser mayores que cero, y debe haber stock suficiente.",
        "edicion": "La API de tu sistema no tiene una operación para editar ventas. Permite registrarlas, consultarlas y eliminarlas.",
        "eliminacion": "Sí. Al eliminar una venta, el sistema devuelve al stock la cantidad de productos que se habían vendido.",
        "consulta": "Se pueden consultar las ventas registradas con cliente, producto, cantidad, precio, total y fecha.",
        "stock": "Cuando se registra una venta, el sistema descuenta automáticamente del stock la cantidad vendida. Si no hay stock suficiente, rechaza la operación."
    },

    "recepciones": {
        "nombre": "Recepción de uvas",
        "alias": ["6", "uva", "uvas", "recepcion", "recepciones", "recepcion de uvas"],
        "descripcion": (
            "🍇 RECEPCIÓN DE UVAS\n\n"
            "Este módulo permite registrar el ingreso de uvas a la bodega "
            "y llevar un seguimiento de la materia prima recibida."
        ),
        "campos": "Cada recepción contiene:\n• Proveedor\n• Variedad de uva\n• Cantidad recibida\n• Fecha\n• Observaciones (opcional)",
        "registro": "Para registrar una recepción, ingresá el proveedor, la variedad, la cantidad y la fecha. También podés agregar observaciones.",
        "edicion": "Sí. Se pueden modificar el proveedor, la variedad, la cantidad, la fecha y las observaciones.",
        "eliminacion": "Sí. La API permite eliminar una recepción registrada.",
        "consulta": "Se pueden consultar las recepciones registradas y visualizar sus datos. El sistema también resume la cantidad recibida y los proveedores."
    },

    "tareas": {
        "nombre": "Tareas",
        "alias": ["7", "tarea", "tareas", "actividad", "actividades"],
        "descripcion": (
            "📋 GESTIÓN DE TAREAS\n\n"
            "Permite organizar las actividades de la bodega, asignar "
            "responsables y realizar el seguimiento de su estado."
        ),
        "campos": "Cada tarea contiene:\n• Descripción\n• Responsable\n• Fecha\n• Estado",
        "registro": "Para registrar una tarea, completá su descripción, el responsable, la fecha y el estado. Después guardá el formulario.",
        "edicion": "Sí. Se puede modificar la descripción, el responsable, la fecha y el estado de una tarea.",
        "eliminacion": "Sí. La API permite eliminar tareas.",
        "consulta": "Se pueden consultar las tareas registradas y ver cuáles están pendientes y cuáles están completadas.",
        "estado": "Una tarea puede marcarse como completada cambiando su estado a «Completada». El sistema cuenta las tareas pendientes y completadas."
    },

    "lotes": {
        "nombre": "Lotes",
        "alias": ["8", "lote", "lotes"],
        "descripcion": (
            "🧾 GESTIÓN DE LOTES\n\n"
            "Permite registrar y organizar los lotes de la bodega "
            "para facilitar su seguimiento."
        ),
        "campos": "Cada lote contiene:\n• Número de lote\n• Fecha\n• Estado",
        "registro": "Para registrar un lote, ingresá el número, la fecha y el estado. Los tres datos son obligatorios.",
        "edicion": "Sí. Se puede modificar el número, la fecha y el estado del lote.",
        "eliminacion": "Sí. La API permite eliminar un lote registrado.",
        "consulta": "Se pueden consultar los lotes guardados y visualizar su número, fecha y estado."
    },

    "vinedos": {
        "nombre": "Viñedos",
        "alias": ["9", "vinedo", "vinedos", "viñedo", "viñedos"],
        "descripcion": (
            "🌱 GESTIÓN DE VIÑEDOS\n\n"
            "Permite registrar y administrar información de los viñedos "
            "relacionados con la actividad de la bodega."
        ),
        "campos": "Cada viñedo contiene:\n• Nombre\n• Variedad\n• Superficie\n• Estado\n• Rendimiento",
        "registro": "Para registrar un viñedo, completá nombre, variedad, superficie, estado y rendimiento.",
        "edicion": "Sí. Se pueden modificar el nombre, la variedad, la superficie, el estado y el rendimiento.",
        "eliminacion": "Sí. La API permite eliminar un viñedo registrado.",
        "consulta": "Se pueden consultar los viñedos registrados. El sistema también permite visualizar cuántos están activos y la superficie total."
    },

    "empleados": {
        "nombre": "Empleados y asistencias",
        "alias": ["10", "empleado", "empleados", "personal", "asistencia", "asistencias"],
        "descripcion": (
            "👥 EMPLEADOS Y ASISTENCIAS\n\n"
            "Este módulo permite administrar los datos del personal "
            "y registrar sus asistencias."
        ),
        "campos": "Los datos de cada empleado son:\n• Nombre\n• Puesto\n• Teléfono\n• Correo\n\nLa asistencia registra el identificador del empleado y la fecha.",
        "registro": "Para registrar un empleado, completá nombre, puesto, teléfono y correo. Para registrar una asistencia, seleccioná al empleado y registrá la fecha.",
        "edicion": "Sí. Se pueden modificar el nombre, puesto, teléfono y correo de un empleado.",
        "eliminacion": "Sí. La API permite eliminar empleados. Para las asistencias, la API permite consultarlas y registrarlas, pero no incluye una ruta para editarlas o eliminarlas.",
        "consulta": "Se pueden consultar los empleados registrados y las asistencias. El sistema muestra información del personal y la cantidad de asistencias."
    },

    "reportes": {
        "nombre": "Reportes",
        "alias": ["11", "reporte", "reportes", "informe", "informes"],
        "descripcion": (
            "📈 REPORTES DEL SISTEMA\n\n"
            "El módulo de reportes reúne información de distintos sectores "
            "de la bodega para facilitar su consulta y análisis."
        ),
        "campos": "Los reportes resumen datos como cantidad de productos, unidades en stock, producción, ventas, uvas recibidas y tareas completadas.",
        "registro": "Los reportes no se cargan como registros independientes. Se generan utilizando la información registrada en los distintos módulos.",
        "edicion": "Los datos se modifican desde el módulo al que pertenecen. El reporte refleja la información disponible al generarse.",
        "eliminacion": "No se eliminan datos desde el reporte. Para quitar un registro, se utiliza la opción correspondiente en su módulo.",
        "consulta": "El sistema permite visualizar los indicadores y generar un archivo PDF llamado Reporte_SGB.pdf con un resumen de la información."
    }
}


def seleccionar_modulo(texto):
    for clave, modulo in MODULOS.items():
        if texto in modulo["alias"]:
            return clave

    return None


def responder(mensaje, modulo_actual=None):
    texto = normalizar(mensaje)

    # SALUDOS
    if texto in ["hola", "buenas", "buen dia", "buenos dias",
                 "buenas tardes", "buenas noches"]:
        return (
            "¡Hola! 🍇 Soy el Asistente Virtual SGB.\n\n"
            "Estoy para ayudarte a conocer las funciones del "
            "Sistema de Gestión de Bodega.\n\n"
            "Escribí AYUDA para ver los módulos disponibles.",
            modulo_actual
        )

    # AYUDA Y MENÚ
    if texto in ["ayuda", "menu", "menú", "opciones", "inicio"]:
        return MENU, None

    # AGRADECIMIENTO
    if "gracias" in texto:
        return (
            "¡De nada! 🍇\n\n"
            "Podés seguir consultándome sobre el módulo actual "
            "o escribir AYUDA para ver el menú.",
            modulo_actual
        )

    # SELECCIÓN DE MÓDULO
    nuevo_modulo = seleccionar_modulo(texto)

    if nuevo_modulo:
        modulo = MODULOS[nuevo_modulo]

        preguntas = (
            "\n\nPodés preguntarme:\n"
            "• ¿Qué datos se registran?\n"
            "• ¿Cómo se registra?\n"
            "• ¿Se puede editar?\n"
            "• ¿Se puede eliminar?\n"
            "• ¿Cómo puedo consultar la información?"
        )

        if nuevo_modulo == "ventas":
            preguntas += "\n• ¿Qué pasa con el stock cuando vendo?"
        elif nuevo_modulo == "tareas":
            preguntas += "\n• ¿Cómo se completa una tarea?"

        return modulo["descripcion"] + preguntas, nuevo_modulo

    # PREGUNTAS SOBRE EL MÓDULO ACTUAL
    if modulo_actual in MODULOS:
        modulo = MODULOS[modulo_actual]

        if any(p in texto for p in [
            "que datos", "datos se registran", "que campos",
            "campos tiene", "informacion se registra", "que se registra"
        ]) or texto in ["datos", "campos"]:
            return "📋 DATOS DEL MÓDULO\n\n" + modulo["campos"], modulo_actual

        if any(p in texto for p in [
            "como registro", "como se registra", "como registrar",
            "como cargo", "como se carga", "crear", "agregar",
            "registrar", "cargar"
        ]):
            return "✍️ ¿CÓMO REGISTRAR?\n\n" + modulo["registro"], modulo_actual

        if any(p in texto for p in [
            "editar", "edito", "modificar", "modifico",
            "actualizar", "cambiar"
        ]):
            return "📝 EDICIÓN\n\n" + modulo["edicion"], modulo_actual

        if any(p in texto for p in [
            "eliminar", "elimino", "borrar", "borro", "quitar"
        ]):
            return "🗑️ ELIMINACIÓN\n\n" + modulo["eliminacion"], modulo_actual

        if any(p in texto for p in [
            "consultar", "consulta", "ver los", "ver la",
            "listar", "mostrar", "informacion", "información"
        ]):
            return "🔎 CONSULTA DE INFORMACIÓN\n\n" + modulo["consulta"], modulo_actual

        if "stock" in texto and modulo_actual == "ventas":
            return "📦 ACTUALIZACIÓN DEL STOCK\n\n" + modulo["stock"], modulo_actual

        if any(p in texto for p in ["estado", "completada", "completar"]) and modulo_actual == "tareas":
            return "✅ ESTADO DE LAS TAREAS\n\n" + modulo["estado"], modulo_actual

        if texto in ["mas", "más", "otra pregunta", "seguir"]:
            return (
                "¡Claro! Podés preguntarme por los datos, el registro, "
                "la edición, la eliminación o la consulta de información "
                "de " + modulo["nombre"] + ".",
                modulo_actual
            )

    # CONSULTAS GENERALES
    if "que es sgb" in texto or "que significa sgb" in texto:
        return MODULOS["sgb"]["descripcion"], "sgb"

    # MENSAJE NO RECONOCIDO
    return (
        "No logré identificar esa consulta. 🤔\n\n"
        "Podés escribir el número o el nombre de otro módulo, "
        "o formular una pregunta sobre el módulo que estás consultando.\n\n"
        "Escribí AYUDA para ver todas las opciones.",
        modulo_actual
    )
