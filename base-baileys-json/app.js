const { createBot, createProvider, createFlow, addKeyword, EVENTS} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')



const flowRealizarReclamos = addKeyword(EVENTS.ACTION)
    .addAnswer(
        [
            '1️⃣ Mantenimiento:',
            '2️⃣ Basura.',
            '3️⃣ Seguridad:',
            '4️⃣ Luminaria.',
            '0️⃣ Para volver al menu principal.',
        ],
        {capture: true},
        async (ctx, {gotoFlow, fallBack, flowDynamic, state}) => {
            // Verificar que la selección sea válida
            if (!["1", "2", "3", "4", "0"].includes(ctx.body)) {
                return fallBack("Respuesta no válida, por favor selecciona una de las opciones.");
            }

            // Asignar una clave personalizada basada en la opción seleccionada
            let customKey;
            switch (ctx.body) {
                case "1":
                    customKey = "mantenimiento";
                    break;
                case "2":
                    customKey = "basura";
                    break;
                case "3":
                    customKey = "seguridad";
                    break;
                case "4":
                    customKey = "luminaria";
                    break;
                case "0":
                    return gotoFlow(flowPrincipal);  // Regresar al menú principal si presiona 0
            }

            // Guardar la clave en el estado para usarla en el siguiente paso
            await state.update({customKey});
            console.log(`DEBUG: customKey guardado en el estado: ${customKey}`);

            // Pedirle al usuario que ingrese más detalles sobre su reclamo
            return await flowDynamic(`Has seleccionado la opción ${customKey}.`);
        }
    )
    .addAnswer(
        "Por favor, describe tu reclamo:",
        {capture: true},
        async (ctx, {state, flowDynamic}) => {
            // Recuperar el customKey desde el estado usando getMyState()
            const myState = await state.getMyState();  // Obtener el estado completo
            const customKey = myState.customKey;  // Recuperar customKey del estado

            // Depuración para verificar si el customKey se está recuperando
            console.log(`DEBUG: customKey recuperado del estado: ${customKey}`);
            console.log(`DEBUG: userResponse: ${ctx.body}`);

            // Asegurarse de que la customKey no es null
            if (!customKey) {
                return await flowDynamic('Hubo un problema al procesar tu reclamo, por favor intenta nuevamente.');
            }

            // Guardar en la base de datos utilizando saveWithCustomData
            //await database.saveWithCustomData(ctx, customKey, ctx.body);

            // Confirmar al usuario que se ha registrado su reclamo y ofrecer la opción de regresar al menú
            return await flowDynamic(`Gracias por tu respuesta. Tu reclamo sobre ${customKey} ha sido registrado. ingresa 'menu' para volver al menu principal`);
        }
    );


const flowConsultarReclamos = addKeyword(EVENTS.ACTION)
    .addAnswer("Consultando tus reclamos recientes...", null, async (ctx, {flowDynamic, state, database}) => {
        const userPhone = ctx.from;

        // Buscar los reclamos del usuario en todas las colecciones

        // Formatear los resultados

        // Solicitar al usuario que seleccione un reclamo por el número asignado
        response += "Escribe 'menu' para volver al menú principal";

        return await flowDynamic(response);
    });


const flowInformacion = addKeyword(EVENTS.ACTION)
    .addAnswer("Aquí tienes información sobre los horarios disponibles en nuestros distintos espacios verdes.", {
        delay: 100,
    })
    .addAnswer(
        [
            '🏞️ *Parque Sarmiento*: Abierto todos los días de 7:00 a 20:00 horas. Es uno de los parques más emblemáticos y antiguos de la ciudad, diseñado por Carlos Thays.',
        ]
    )
    .addAnswer(
        [
            '⚽ *Parque del Kempes*: Abierto todos los días de 7:00 a 22:00 horas. Este parque es popular para actividades deportivas y está ubicado cerca del Estadio Mario Alberto Kempes.',
        ]
    )
    .addAnswer(
        [
            '🏰 *Parque del Chateau*: Abierto de lunes a sábados de 15:00 a 20:00, y los domingos de 8:00 a 20:00 horas.',
        ]
    )
    .addAnswer(
        [
            '🌿 *Parque de la Biodiversidad*: Abierto de martes a domingo de 9:00 a 17:00 horas, enfocado en la conservación de flora y fauna.',
        ]
    )
    .addAnswer(
        [
            '🌼 *Parque Las Heras*: Abierto de 7:00 a 20:00 horas. Recientemente remodelado, este parque ofrece áreas recreativas y espacios verdes con vistas al río Suquía.',
        ]
    )
    .addAnswer(
        [
            '🏛️ *Plaza España*: Abierta todos los días de 8:00 a 20:00 horas. Esta plaza es un punto importante de la ciudad, con actividades recreativas y culturales.',
        ]
    )
    .addAnswer(
        [
            '🌲 *Parque General Juan Bautista Bustos*: Abierto de 8:00 a 20:00 horas. Es un parque nuevo en la zona norte de la ciudad.',
        ])
    .addAnswer(
        [
            "🌲 *Escribe 'menu' para volver al menú principal",
        ]
    )

const flowNovedades = addKeyword(EVENTS.ACTION)
    .addAnswer("Proximamente:", {
        delay: 100,
    })
    .addAnswer("Escribe 'menu' para volver al menú principal")

const flowContacto = addKeyword(EVENTS.ACTION)
    .addAnswer("Puedes contactarnos a través de los siguientes medios:", {
        delay: 100,
    })
    .addAnswer("📞 Teléfono: 0800-123-4567")
    .addAnswer("📧 Correo electrónico: muni@gmail.com")
    .addAnswer("🌐 Sitio web: www.municipalidad.com")
    .addAnswer("Escribe 'menu' para volver al menú principal")

const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'menu', 'home'])
    .addAnswer('👋 ¡Hola! Bienvenido/a al chatbot de información ciudadana. Estoy aquí para ayudarte con tus consultas. ¿En qué puedo asistirte hoy?')
    .addAnswer(
        [
            '📚 Elige una opción enviando un mensaje con el número correspondiente:',
            '1️⃣ Realizar reclamo.',
            '2️⃣ Consultar reclamos.',
            '3️⃣ Información.',
            '4️⃣ Novedades.',
            '5️⃣ Contacto.',
        ],
        {capture: true},
        async (ctx, {gotoFlow, fallBack, flowDynamic}) => {
            if (!["1", "2", "3", "0", "4", "5"].includes(ctx.body)) {
                return fallBack(
                    "Respuesta no válida, por favor selecciona una de las opciones."
                );
            }
            switch (ctx.body) {
                case "1":
                    return gotoFlow(flowRealizarReclamos);
                case "2":
                    return gotoFlow(flowConsultarReclamos);
                case "3":
                    return gotoFlow(flowInformacion);
                case "4":
                    return gotoFlow(flowNovedades);
                case "5":
                    return gotoFlow(flowContacto);
                case "0":
                    return await flowDynamic(
                        "Saliendo... Puedes volver a acceder a este menú escribiendo 'menu'."
                    );
            }
        }
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowRealizarReclamos, flowConsultarReclamos, flowInformacion, flowNovedades, flowContacto])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
