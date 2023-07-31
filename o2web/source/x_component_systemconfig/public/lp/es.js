o2.xApplication.systemconfig.LP = {
    "title": "Configuración del sistema",
    "searchKey": "Buscar opciones de configuración",
    "default": "Predeterminado",
    "permissionDenied": "El usuario actual no tiene suficientes permisos. Debe acceder a la configuración del sistema con una cuenta de administrador.",

    "yes": "Sí",
    "no": "No",
    "uploadInfo": "Arrastre el archivo aquí o haga clic para subir",

    "baseConfig": "Configuración base",
    "systemInfo": "Información del sistema",
    "uiConfig": "Configuración de estilo",
    "componentDeploy": "Implementación de componentes",
    "resourceDeploy": "Implementación de recursos",
    "serviceDeploy": "Implementación de servicios",

    "securityConfig": "Configuración de seguridad",
    "passwordConfig": "Contraseñas",
    "loginConfig": "Inicio de sesión",
    "ssoConfig": "Inicio de sesión único (SSO)",
    "ternaryManagement": "Gestión ternaria",

    "serverConfig": "Configuración del servidor",
    "serversConfig": "Servidores",
    "centerServer": "Servidor central",
    "appServer": "Servidor de aplicaciones",
    "webServer": "Servidor web",
    "databaseServer": "Base de datos",
    "storageServer": "Almacenamiento",
    "cacheConfig": "Caché",
    "clusterConfig": "Clúster",
    "orgConfig": "Organización",
    "processConfig": "Procesos",
    "cloudConfig": "Servicios en la nube",
    "dumpConfig": "Copia de seguridad",
    "worktimeConfig": "Horario laboral",

    "messageConfig": "Mensajes",
    "msgTypeConfig": "Tipo",
    "pushConfig": "Notificaciones push",
    "mailConfig": "Correo electrónico",
    "smsConfig": "Mensajes de texto (SMS)",
    "mqConfig": "Cola de mensajes",

    "queryIndexConfig": "índices",


    "mobileConfig": "Configuración móvil",
    "connectConfig": "Conexión",
    "appConfig": "Aplicación",
    "moduleConfig": "Módulo",
    "iconConfig": "Icono",
    "ddConfig": "DingTalk",
    "wechatConfig": "WeChat",
    "welinkConfig": "Welink",
    "appTools": "Herramientas de aplicación",
    "integrationConfig": "Integración de aplicaciones",

    "select": "Seleccionar",

    "_systemInfo": {
        "title": "Configuración de la información básica del sistema",
        "systemName": "Nombre del sistema",
        "systemNameInfo": "El nombre de su sistema, se mostrará en la página de inicio de sesión y en la barra de título del navegador.",
        "systemSubTitle": "Subtítulo del sistema",
        "systemSubTitleInfo": "El subtítulo de su sistema, se mostrará debajo de la página de inicio de sesión.",
        "systemVersion": "Versión actual del sistema",
        "systemVersionInfo": "La versión actual del sistema.",
        "baseInfo": "Información básica",
        "systemStatus": "Estado del sistema",
        "moduleStatus": "Estado de ejecución del módulo",
        "language": "Idioma",
        "languageInfo": "Configurar el idioma del servidor.",
        "languageValues": {
            "zh-CN": "Chino simplificado",
            "en": "Inglés",
			"es": "español"
        },

        "running": "En ejecución",
        "stop": "Detenido",
        "enable": "Habilitado",

        "server": "Servidor",
        "node": "Nodo",
        "serverInfo": "Información del servidor",
        "webServer": "Servidor web",
        "appServer": "Servidor de aplicación",
        "centerServer": "Servidor central",
        "dataServer": "Servicio de base de datos",
        "storageServer": "Servicio de almacenamiento de archivos",
        "dataNode": "Base de datos",
        "databaseUrl": "URL de conexión a la base de datos",

        "byModule": "Por módulo de aplicación",
        "byServer": "Por nodo del servidor",

        "storageNode": "Almacenamiento de archivos",

        "serverData": {
            // "exposeJest": "接口文档(exposeJest)",
            "httpProtocol": "Protocolo HTTP (httpProtocol)",
            "host": "Anfitrión (host)",
            "port": "Puerto (port)",
            "proxyHost": "Anfitrión del proxy (proxyHost)",
            "proxyPort": "Puerto del proxy (proxyPort)",
            "requestLogEnable": "Habilitar registro HTTP",
            "requestLogBodyEnable": "Registrar contenido del cuerpo",
            "requestLogRetainDays": "Días para mantener el registro",
            "sslEnable": "Habilitar SSL (sslEnable)",
            // "statEnable": "启用Druid",

            "cacheSize": "Tamaño de caché (cacheSize)",
            "includes": "Clases incluidas (includes)",
            "excludes": "Clases excluidas (excludes)",
            "jmxEnable": "Habilitar JMX (jmxEnable)",
            "lockTimeout": "Tiempo de espera para bloqueos de tabla (lockTimeout)",
            "logLevel": "Nivel de registro (logLevel)",
            "maxIdle": "Número máximo de conexiones inactivas (maxIdle)",
            "maxTotal": "Número máximo total de conexiones (maxTotal)",
            "slowSqlMillis": "Umbral de SQL lento (slowSqlMillis)",
            "statFilter": "Habilitar combinación de sentencias Druid (statFilter)",
            "tcpPort": "Puerto TCP (tcpPort)",
            "webPort": "Puerto web (webPort)"
        },
        "storageData": {
            "port": "Puerto FTP (port)",
            "sslEnable": "Habilitar SSL (sslEnable)",
            "name": "Nombre (name)",
            "passivePorts": "Puertos de modo pasivo (passivePorts)",
            "prefix": "Prefijo de ruta (prefix)",
            "deepPath": "Usar rutas profundas (deepPath)"
        },
        "storageAccounts": {
            "protocol": "Protocolo",
            "username": "Nombre de usuario",
            "weight": "Peso",
            "name": "Nombre",
            "prefix": "Prefijo de ruta",
            "deepPath": "Usar rutas profundas",
            "host": "Anfitrión",
            "port": "Puerto"

        },
        "moduleData": {
            "node": "Nodo del servidor",
            "contextPath": "Ruta de contexto",
            "port": "Puerto del servidor",
            "sslEnable": "Habilitar SSL",
            "proxyHost": "Anfitrión del proxy",
            "proxyPort": "Puerto del proxy",
            "reportDate": "Fecha del último informe",
            "moduleName": "Nombre del módulo",
            "className": "Clase"

        }
    },
    "operation": {
        "edit": "Editar ",
        "ok": "Aceptar",
        "cancel": "Cancelar",
        "enable": "Habilitar",
        "disable": "Deshabilitar"
    },
    "_component": {
        "open": "Abrir",
        "edit": "Editar ",
        "uninstall": "Desinstalar",

        "deploy": "Desplegar componente",

        "removeComponentTitle": "Confirmación",
        "removeComponent": "¿Está seguro de que desea desinstalar el componente: {name}?",
        "removeComponentOk": "El componente ha sido desinstalado",

        "deploySuccess": "El componente se ha desplegado correctamente",

        "selectIcon": "Seleccionar icono",
        "clearIcon": "Borrar icono",

        "name": "Nombre",
        "title": "Título",
        "path": "Ruta",
        "urlPathInfo": "Puede agregar una ruta como URL para una página web utilizando “@url:”, como “@url:http://www.bing.com”",
        "visible": "¿Es visible?",
        "allowList": "Permitido",
        "denyList": "Denegado",
        "icon": "Icono",

        "upload": "Cargar recursos",
        "uploadWarn": "Al cargar un paquete ZIP de componente, los componentes existentes serán reemplazados. ¡Por favor, tenga cuidado con esta operación!",

        "componentDataError": "El nombre, la ruta y el título del componente no pueden estar vacíos."
    },
    "_resource": {
        "webResource": "Desplegar recursos web",
        "webResourceInfo": "Puede desplegar aquí recursos web, cargar archivos de recursos estáticos o archivos zip, que se desplegarán en el servidor web del sistema y pueden ser accedidos mediante el protocolo HTTP.",
        "serviceResource": "Desplegar servicios personalizados",
        "serviceResourceInfo": "Puede desplegar aquí su proyecto personalizado desarrollado, cargando un archivo jar compilado o un archivo war. Después de desplegar, debe reiniciar el servidor.",

        "componentResource": "Desplegar componentes",
        "componentResourceInfo": "Puede desplegar componentes O2OA personalizados que haya desarrollado o que haya obtenido oficialmente desde aquí. Los componentes de O2OA son carpetas o archivos zip llamados 'x_component_{nombre del componente}'. Para obtener más información, consulte la <a href='https://www.o2oa.net/develop.html' target='_blank'>comunidad oficial de O2OA</a>.",

        "upload": "Cargar recursos",
        "webUploadWarn": "Cargar un archivo de recursos estáticos para desplegar, los archivos zip se extraerán automáticamente",
        "serviceUploadWarn": "Cargar un archivo jar o war para desplegar",

        "overwrite": "Método de despliegue",
        "overwriteFalse": "Subir después de eliminar: Eliminar el archivo o carpeta con el mismo nombre antes de subirlo.",
        "overwriteTrue": "Sobrescribir: Sobrescribir directamente el archivo o carpeta con el mismo nombre.",

        "deployPath": "Ruta de despliegue",
        "deployPathInfo": "Si carga un archivo ZIP, la ruta puede estar vacía; si carga un archivo individual, debe especificar una ruta de despliegue. Ejemplo: /myWebResource/subPath",

        "noDeployFile": "Primero debe seleccionar el archivo de recursos que desea desplegar.",
        "deploySuccess": "Despliegue de recursos exitoso.",

        "notWebResource": "<span style='color: red'>El servidor actual no permite el despliegue de recursos web en el frontend. Puede habilitar esta función en Configurar servidor - Tareas del servidor.</span>",
        "notServiceResource": "<span style='color: red'>El servidor actual no permite el despliegue de servicios personalizados en el frontend. Puede habilitar esta función en Configurar servidor - Tareas del servidor.</span>"
    },
    "_uiConfig": {
        "baseConfig": "Configuración básica",
        "menuConfig": "Configuración del menú principal",
        "lnkConfig": "Configuración de la barra lateral",
        "userConfig": "Configuración de la interfaz de usuario",

        "openStatus": "Ingreso al sistema",
        "openStatusInfo": "Cada vez que ingrese al sistema O2OA, se abrirá automáticamente la última aplicación abierta antes de salir del sistema. Puede cambiar este comportamiento aquí.",
        "openStatusCurrent": "Abrir la misma aplicación y mantener el estado de la aplicación tal como estaba en la última sesión (por defecto)",
        "openStatusApp": "Abrir la aplicación que se abrió por última vez en la sesión anterior y establecer la página de inicio como la aplicación actual",
        "openStatusIndex": "Solo abrir la aplicación de la página de inicio",

        "skin": "Apariencia del sistema",
        "skinConfig": "Permitir modificar la apariencia del sistema",
        "skinConfigInfo": "¿Permitir a los usuarios personalizar la apariencia del sistema?",
        "skinDefault": "Apariencia predeterminada del sistema",
        "skinDefaultInfo": "Establecer la apariencia predeterminada del sistema",
        "scaleConfig": "Permitir zoom",
        "scaleConfigInfo": "¿Permitir a los usuarios personalizar la escala de visualización del sistema?",

        "defaultMenuInfo": "Después de guardar la configuración del menú predeterminado, los usuarios que no hayan personalizado su configuración de menú verán el menú según esta configuración.",
        "forceMenuInfo": "Después de guardar la configuración del menú forzado, todos los usuarios verán el menú según esta configuración y se anularán las configuraciones personalizadas.",
        "userMenuInfo": "Se borrarán todas las configuraciones personalizadas de menú de los usuarios y se mostrará el menú de manera predeterminada.",

        "clearDefaultMenuDataTitle": "Configuración",
        "clearDefaultMenuData": "¿Está seguro de querer borrar la configuración de menú predeterminada?",
        "clearDefaultMenuDataSuccess": "Se ha borrado la configuración de menú predeterminada.",
        "clearForceMenuDataTitle": "Configuración",
        "clearForceMenuData": "¿Está seguro de querer borrar la configuración de menú forzado?",
        "clearForceMenuDataSuccess": "Se ha borrado la configuración de menú forzado.",

        "clearUserMenuData": "Borrar configuración personalizada de menú de usuario",
        "clearUserMenuDataSuccess": "Se ha borrado la configuración personalizada de menú de usuario.",
        "clearUserMenuDataConfirm": "¿Está seguro de querer borrar la configuración personalizada de menú de todos los usuarios?",

        "saveDefaultMenuDataSuccess": "Se ha guardado correctamente la configuración de menú predeterminada.",
        "saveForceMenuDataSuccess": "Se ha guardado correctamente la configuración de menú forzado.",

        "defaultMenu": "Configuración de menú predeterminada",
        "forceMenu": "Configuración de menú forzado",
        "userMenu": "Configuración personalizada de menú de usuario",

        "saveMenu": "Guardar configuración",
        "clearMenu": "Borrar configuración",
        "loadMenu": "Cargar configuración",
        "clearUserMenu": "Borrar configuración",

        "menu": {
            "application": "App",
            "process": "Proceso",
            "cms": "Info",
            "query": "Datos",

            "defaultMenu": "Restaurar estado de menú predeterminado"
        },
        "deleteLink": "Eliminar acceso directo a aplicación común"
    },
    "_passwordConfig": {
        "personPassword": "Contraseña de usuario",
        "adminPassword": "Contraseña de administrador",
        "saveSuccess": "Guardado correctamente.",
        "passwordScript": "Script de contraseña",

        "newPersonPassword": "Contraseña inicial para nuevos usuarios",
        "newPersonPasswordInfo": "Cuando se crea un nuevo usuario, se generará una contraseña inicial según la siguiente configuración. Los usuarios pueden cambiar su contraseña después de iniciar sesión en el sistema.",
        "initialPassword": "Contraseña inicial",
        "initialPasswordText": "Ingrese la contraseña inicial",
        "initialPasswordTypeOptions": {
            "mobile": "Últimos 6 dígitos del número de teléfono móvil",
            "unique": "Últimos 6 dígitos del código único",
            "employee": "Número de empleado",
            "pinyin": "Nombre completo del empleado transcrito a pinyin",
            "text": "Contraseña fija",
            'script': "Personalizar mediante script"
        },
        "initialPasswordType": {
            "mobileScript": "return person.getMobile().slice(-6)",
            "uniqueScript": "return person.getUnique().slice(-6)",
            "employeeScript": "return person.getEmployee()",
            "pinyinScript": "return person.getPinyin()",
            "textInfo": "La contraseña que ingrese en el cuadro de texto será utilizada como la contraseña inicial para los nuevos usuarios creados.",
            'scriptInfo': "Ingrese el script de JavaScript a continuación, que devuelve una cadena para ser utilizada como la contraseña inicial para los nuevos usuarios creados. Puede utilizar el objeto 'person' para obtener información relacionada con el usuario. Por ejemplo, para usar el nombre completo del usuario transcrito a pinyin como contraseña inicial, puede usar el siguiente script: return person.getPinyin()"
        },

        "passwordPeriod": "Días de caducidad de la contraseña",
        "passwordPeriodInfo": "Los usuarios que no cambian su contraseña después de los días establecidos tendrán que cambiarla obligatoriamente al iniciar sesión en el sistema. Establecer en 0 significa que la contraseña no caduca.",

        "passwordRegex": "Complejidad de la contraseña",
        "passwordRegexInfo": "Establecer los requisitos de complejidad de la contraseña para los usuarios",

        "passwordRegexMin": "Longitud mínima",
        "passwordRegexMax": "Longitud máxima",
        "passwordRegexLength": "Longitud de la contraseña",
        "passwordRule": "Reglas de la contraseña",
        "passwordRuleValue": {
            "useLowercase": "Debe contener letras minúsculas",
            "useNumber": "Debe contener números",
            "useUppercase": "Debe contener letras mayúsculas",
            "useSpecial": "Debe contener caracteres especiales (#?!@$%^&*-)"
        },
        "passwordRuleRegex": {
            "useLowercase": "(?=.*[a-z])",
            "useNumber": "(?=.*\\d)",
            "useUppercase": "(?=.*[A-Z])",
            "useSpecial": "(?=.*?[#?!@$%^&*-])"
        },
        "savePasswordRule": "Guardar la configuración de reglas de contraseña",
        "passwordLengthText": "{n} caracteres, {text}",

        "passwordRsa": "Transmisión cifrada de contraseñas",
        "passwordRsaInfo": "Por defecto, el sistema transmite contraseñas en texto claro. Puede habilitar esta opción para activar la transmisión cifrada de contraseñas. (Se requiere reiniciar el servidor después de realizar cambios)",


        "adminPasswordInfo": "Puede cambiar la contraseña del superadministrador xadmin aquí. (Se requiere reiniciar el servidor después de realizar cambios)",
        "modifyAdminPassword": "Cambiar la contraseña de administrador",

        "oldPassword": "Contraseña actual",
        "newPassword": "Nueva contraseña",
        "confirmPassword": "Confirmar contraseña",

        "ternaryPassword": "Contraseña de los administradores tricéfalos",
        "ternaryPasswordInfo": "Si ha habilitado la gestión tricéfala, el administrador del sistema puede cambiar las contraseñas del administrador del sistema (systemManager), el administrador de seguridad (securityManager) y el auditor de seguridad (auditManager) aquí.",
        "modifySystemManagerPassword": "Cambiar la contraseña del administrador del sistema",
        "modifySecurityManagerPassword": "Cambiar la contraseña del administrador de seguridad",
        "modifyAuditManagerPassword": "Cambiar la contraseña del auditor de seguridad",

        "passwordDisaccord": "La nueva contraseña que ingresó y la confirmación de la contraseña no coinciden.",
        "passwordEmpty": "Por favor ingrese la contraseña actual, la nueva contraseña y la confirmación de la contraseña.",

        "tokenEncryptType": "Método de cifrado de la contraseña",
        "tokenEncryptTypeInfo": "O2OA admite varios métodos de cifrado de contraseñas y tokens que se pueden seleccionar según sea necesario. Para obtener más información, consulte: <a href='https://www.o2oa.net/search.html?q=%E5%9B%BD%E5%AF%86' target='_blank'>国密</a>",
        "tokenEncryptTypeLabel": "Método de cifrado",
        "encryptTypeOptions": {
            "default": "Predeterminado",
            "sm4": "Algoritmo de cifrado comercial nacional"
        },
        "tokenEncryptTypeInfo3": "<div style='color: red'>Nota: Después de hacer clic en 'Aceptar para cambiar el método de cifrado de la contraseña', esta configuración tendrá efecto inmediato.<ul style='line-height: 30px'><li>Esto causará: 1. La pérdida de la sesión de inicio de todos los usuarios; 2. Debido al cambio en el método de cifrado, todos los usuarios existentes no podrán iniciar sesión en el sistema.</li>" +
            "<li>Debe seguir los siguientes pasos para usar normalmente el sistema: <br> Ingrese al sistema nuevamente con la cuenta xadmin y restablezca las contraseñas de todos los usuarios de cualquier manera.</li></ul></div>",
        "tokenEncryptTypeButton": "Aceptar para cambiar el método de cifrado de la contraseña",
        "changeTokenEncryptTypeInfo": "¿Está seguro de que desea cambiar el método de cifrado de la contraseña?"

    },
    "_loginConfig": {
        "baseConfig": "Configuración básica",
        "moreConfig": "Más configuraciones",
        "ldapConfig": "Autenticación LDAP",
        "captchaLogin": "Habilitar inicio de sesión con código CAPTCHA",
        "codeLogin": "Habilitar inicio de sesión con código SMS",
        "bindLogin": "Habilitar inicio de sesión escaneando un código QR",
        "faceLogin": "Habilitar inicio de sesión mediante reconocimiento facial",
        "captchaLoginInfo": "Después de habilitar esto, se deben ingresar correctamente los códigos CAPTCHA de imagen para iniciar sesión.",
        "codeLoginInfo": "Después de habilitar esto, el inicio de sesión con código SMS estará disponible.",
        "bindLoginInfo": "Después de habilitar esto, se puede iniciar sesión escaneando un código QR.",
        "faceLoginInfo": "Después de habilitar esto, se puede iniciar sesión mediante reconocimiento facial. Los usuarios pueden establecer características faciales en su configuración personal. Después de habilitar esto, debe crear una configuración SSO denominada 'face' con la clave xplatform (esta es una función experimental y se requiere https).",

        "loginError": "Manejo de errores de inicio de sesión",
        "loginErrorInfo": "Si los usuarios ingresan la contraseña incorrecta varias veces durante el inicio de sesión, se bloqueará su cuenta. Puede establecer el límite de errores de inicio de sesión consecutivos y la duración del bloqueo de la cuenta aquí.",

        "loginErrorCount": "Límite de errores de inicio de sesión",
        "lockTime": "Duración del bloqueo de la cuenta (en minutos)",

        "tokenExpired": "Tiempo de sesión",
        "tokenExpiredInfo": "Si los usuarios no interactúan con el servidor durante mucho tiempo después de iniciar sesión, se cerrará su sesión. Puede establecer la duración de la sesión aquí en minutos.",

        "tokenName": "Nombre del token",
        "tokenNameInfo": "El nombre predeterminado del token es x-token. Puede modificar el nombre del token aquí para evitar conflictos de cookies en el mismo dominio. Esto es especialmente útil cuando se implementan varias instancias de O2OA en el mismo dominio. (Se requiere reiniciar el servidor)",

        "tokenCookieHttpOnly": "Habilitar httponly",
        "tokenCookieHttpOnlyInfo": "Si la cookie que guarda el token está habilitada para httponly",

        "tokenCookieSecure": "Habilitar cookies seguras",
        "tokenCookieSecureInfo": "Si está habilitado seguro para la cookie que guarda el token, indicando que esta cookie solo se transmitirá bajo el protocolo https",

        "enableSafeLogout": "Habilitar el cierre de sesión seguro",
        "enableSafeLogoutInfo": "Después de habilitar esto, si cierra sesión en cualquier terminal, se cerrará automáticamente la sesión en todas las terminales.",

        "register": "Habilitar registro de auto servicio",
        "registerInfo": "Aquí se configura si se permite a los usuarios registrarse en el sistema por sí mismos, y el método de registro de auto servicio.",
        "registerValues": {
            "disable": "No permitir",
            "captcha": "Registrarse con código CAPTCHA",
            "code": "Registrarse con código SMS"
        },

        "loginPage": "Iniciar sesión utilizando la página del portal",
        "loginPageInfo": "El sistema admite el uso de una página de portal personalizada como página de inicio de sesión. Proporcionamos plantillas de aplicaciones de inicio de sesión gratuitas en nuestra tienda de aplicaciones.",
        "loginPagePortal": "Portal de inicio de sesión",

        "selectPortal": "Seleccione un portal",

        "indexPage": "Usar la página de portal como página principal del sistema",
        "indexPageInfo": "Puede utilizar una página de portal personalizada como página principal del sistema. Esta página se abrirá después de iniciar sesión.",
        "indexPagePortal": "Portal de página principal",

        "ldapAuthEnable": "Habilitar autenticación LDAP",
        "ldapAuthEnableInfo": "Después de habilitar esto, el inicio de sesión de los usuarios utilizará la autenticación LDAP en lugar de las contraseñas de este sistema. Por favor, configure correctamente los siguientes parámetros de LDAP.",
        "ldapAuthUrl": "Dirección de LDAP",
        "ldapAuthUrlInfo": "Dirección del servicio de LDAP. Ejemplo: ldap://nombre de dominio o IP:puerto",
        "baseDn": "Búsqueda de raíz de LDAP (BaseDN)",
        "baseDnInfo": "Nombre de la raíz de la búsqueda de LDAP, por ejemplo: dc=zone,DC=COM",
        "userDn": "Atributo de vinculación de usuario de autenticación",
        "userDnInfo": "Atributo de vinculación de usuario de autenticación: uid, número de teléfono, código de empleado o correo electrónico (asegúrese de que los datos encontrados en baseDn son únicos y se pueden encontrar personas relevantes en O2, como uid o correo electrónico, etc.)",

        "superPermission": "Habilitar contraseña de superadministrador",
        "superPermissionInfo": "Al habilitar esto, se puede iniciar sesión en otras cuentas de usuario con la contraseña de superadministrador (xadmin), lo que permite a los administradores realizar el mantenimiento de datos y solucionar problemas en la identidad de un usuario normal.",

        "bindDnUser": "Usuario de administración de vinculación",
        "bindDnUserInfo": "Enlace a un administrador con permisos de administración para realizar consultas de autenticación, como cn=root.",
        "bindDnPwd": "Contraseña de usuario de administración de vinculación",
        "bindDnPwdInfo": "Contraseña de administrador para enlazar.",
        "ldapEnabledError": "Por favor, configure todos los parámetros de LDAP antes de habilitar la autenticación LDAP."

    },
    "_ssoConfig": {
        "ssoConfig": "Claves de autenticación",
        "ssoConfigInfo": "Puede crear claves de autenticación para varios sistemas para iniciar sesión en SSO y llamar a servicios.",
        "ssoConfigInfo2": "Cada clave de autenticación requiere un nombre y una clave. Esta clave es la clave pública utilizada para generar tokens de acceso.",
        "addSSOConfig": "Agregar configuración de clave de autenticación",
        "editSSOConfig": "Editar configuración de clave de autenticación",
        "isEnable": "Habilitar",
        "ssoConfigName": "Nombre de la clave de autenticación",
        "ssoConfigKey": "Clave",

        "ssoConfigKeyInfo": "La longitud de la clave es un múltiplo de 8",
        "ssoKeyLengthError": "Mantenga la longitud de la clave en múltiplos de 8",

        "removeSSOConfigTitle": "Confirmar eliminación de configuración de clave de autenticación",
        "removeSSOConfig": "¿Está seguro de que desea eliminar la configuración de clave de autenticación: '{name}'?",

        "ssoDataError": "El nombre y la clave de autenticación no pueden estar vacíos.",
        "ssoSameNameError": "Ya existe una clave de autenticación con el nombre '{name}'. Por favor, use otro nombre.",

        "useSSOConfig": "Cómo utilizar las claves de autenticación",
        "useSSOConfigInfo": "Las claves de autenticación se utilizan en dos situaciones:",
        "useSSOConfigInfo1": "1. Cuando un sistema externo necesita iniciar sesión en SSO con O2OA.",
        "useSSOConfigInfo2": "2. Cuando un sistema externo necesita llamar a los servicios de la plataforma O2OA.",
        "useSSOConfigInfo3": "Debe proporcionar el nombre y la clave de autenticación al sistema externo, que utilizará el algoritmo 3DES para cifrar el texto '<span style='color: blue'>person#timestamp</span>' con la clave para obtener un token temporal (token) para acceder a O2OA.<br/>" +
            "<span style='color: blue'>person</span>: representa el nombre de usuario, el código único o el número de empleado del usuario especificado. (El campo de usuario relacionado entre el sistema externo y O2OA debe determinarse según cada caso).<br/>" +
            "<span style='color: blue'>timestamp</span>: representa el número de milisegundos desde las 0:00 horas, del 1 de enero de 1970 hasta el momento actual. (Para garantizar la validez del token, es válido por solo 1 minuto)<br/><br/>" +
            "Después de generar el token, el sistema externo puede utilizar el siguiente enlace para autenticarse en O2OA:<br/>" +
            "http://servername/x_desktop/sso.html?client={<span style='color: blue'>client</span>}&xtoken={<span style='color: blue'>token</span>}&redirect={<span style='color: blue'>redirect</span>}<br/>" +
            "<span style='color: blue'>client</span>: representa el nombre de la clave de autenticación utilizada.<br/>" +
            "<span style='color: blue'>token</span>: representa el token temporal generado.<br/>" +
            "<span style='color: blue'>redirect</span>: representa la dirección a la que se redirigirá después de una autenticación correcta.<br/>",

        "useSSOConfigInfo4": "Para obtener más información sobre la configuración de claves de autenticación, <a target='_blank' href='https://www.o2oa.net/search.html?q=%E9%89%B4%E6%9D%83'>haga clic aquí</a>.",

        "ssoTokenTools": "Herramientas relacionadas",
        "ssoTokenCode": "Ver código de ejemplo cifrado",
        "ssoTokenCheck": "Verificar la validez del token",

        "oauthConfig": "Configuración de OAuth",
        "oauthClientConfig": "Configuración del cliente OAuth",
        "oauthServerConfig": "Configuración del servidor OAuth",

        "oauthClientConfigInfo": "Si se utiliza la plataforma O2OA como servidor de autenticación OAuth2, puede configurar múltiples clientes OAuth en esta página para permitir que otros sistemas inicien sesión y autoricen a través de O2OA.",
        "oauthServerConfigInfo": "Si ya cuenta con un servidor de autenticación OAuth2, puede configurar varios servidores OAuth aquí para permitir que este sistema inicie sesión y autorice a través de ellos.",

        "addOauthClientConfig": "Agregar configuración del cliente OAuth",
        "addOauthServerConfig": "Agregar configuración del servidor OAuth",
        "editOauthClientConfig": "Editar cliente OAuth",
        "editOauthServerConfig": "Editar servidor OAuth",

        "removeOauthConfigTitle": "Confirmación",
        "removeOauthConfig": "¿Está seguro de que desea eliminar la configuración de OAuth: '{name}'?",

        "oauthClientDataError": "El ID del cliente (ClientId) y el secreto del cliente (ClientSecret) no pueden estar vacíos.",
        "oauthClientSameNameError": "Ya existe un cliente con el ID '{name}'. Por favor, use otro ID.",

        "oauth_clientId": "ID",
        "oauth_clientSecret": "Clave secreta",
        "oauth_mapping": "Mapeo de retorno",
        "oauth_name": "Nombre",
        "oauth_displayName": "Nombre para mostrar",
        "oauth_icon": "URL del icono",
        "oauth_authAddress": "Dirección de solicitud de clave",
        "oauth_authParameter": "Parámetros de solicitud de clave",
        "oauth_authMethod": "Método de solicitud de clave",

        "oauth_tokenAddress": "Dirección de solicitud de token",
        "oauth_tokenParameter": "Parámetros de solicitud de token",
        "oauth_tokenMethod": "Método de solicitud de token",
        "oauth_tokenType": "Formato del token",

        "oauth_infoAddress": "Dirección de solicitud de información",
        "oauth_infoParameter": "Parámetros de solicitud de información",
        "oauth_infoMethod": "Método de solicitud de información",
        "oauth_infoType": "Formato de información",

        "oauth_infoCredentialField": "Campo de información personal",
        "oauth_bindingField": "Campo de usuario vinculado",

        "oauth_infoScriptText": "Texto del script de procesamiento de información",

        "infoScriptTextInfo": "Si el formato de la información no es JSON ni FORM, puede utilizar un script para dar formato a la información como un objeto JSON para que el sistema pueda procesarla correctamente. Escriba el script en el editor de scripts a continuación y devuelva un objeto JSON. Puede utilizar <span style='color: blue'>this.text</span> para obtener el texto original de la respuesta de información."
    },
    "_ternaryManagement": {
        "enable": "Habilitar gestión de tres responsables",
        "enableInfo": "El sistema admite la gestión de seguridad del sistema mediante la división y delegación de funciones de los tres responsables: el administrador del sistema, el administrador de seguridad y el auditor de seguridad. Al habilitar la gestión de tres responsables, se desactivará el usuario y los permisos de xadmin y se activará el registro de auditoría del sistema (se requiere reiniciar el servidor) <br>" +
            "Las funciones de los tres responsables son las siguientes: " +
            "<ul><li>Administrador del sistema (usuario incorporado del sistema: systemManager): responsable de la gestión de usuarios, organizaciones y mantenimiento del sistema; </li>" +
            "<li>Administrador de seguridad (usuario incorporado del sistema: securityManager): responsable de la configuración de permisos y de la verificación y análisis de registros de auditoría de usuarios y operaciones de administradores del sistema; </li>" +
            "<li>Auditor de seguridad (usuario incorporado del sistema: auditManager): responsable de la auditoría y seguimiento de las acciones de los administradores de seguridad.</li></ul>" +
            "La aplicación analiza los registros de operaciones de cada día a la 1 AM para que los tres administradores puedan realizar consultas de auditoría.<br>" +
            "Para utilizar completamente la función de gestión de tres responsables, también debe instalar la aplicación 'Gestión de tres responsables' desde el mercado de aplicaciones." +
            "Puede encontrar más información sobre la gestión de tres responsables en los siguientes documentos y videos: <a href='https://www.o2oa.net/search.html?q=%E4%B8%89%E5%91%98%E7%AE%A1%E7%90%86' target='_blank'>Gestión de tres responsables</a>",
        "logRetainDays": "Días de retención de registros",
        "logRetainDaysInfo": "Establece el máximo número de días que se pueden retener los registros.",

        "logBodyEnable": "Registre el contenido del cuerpo",
        "logBodyEnableInfo": "Registrar el contenido del cuerpo proporcionará información de registro más detallada, pero también aumentará significativamente el uso del espacio en disco y el consumo de recursos del servidor."
    },
    "_databaseServer": {
        "databaseSource": "Origen de datos",
        "entity": "Clase de entidad",
        "tools": "Copia de seguridad",
        "infoInner": "Está utilizando la base de datos integrada de O2OA. La base de datos integrada de O2OA es una base de datos de memoria incrustada adecuada para entornos de desarrollo y demostración, pero no para entornos de producción. " +
            "Si se utiliza en un entorno de producción, se recomienda utilizar una base de datos comercial con mayor rendimiento y estabilidad.",
        "infoExternal": "Ha utilizado una base de datos externa y se ha desactivado la base de datos integrada de O2OA.",

        "info": "<span style='color: red'>La modificación de la configuración de la base de datos afectará a los datos existentes del sistema en la mayoría de los casos. ¡Modifique esta configuración con cuidado!</span>",
        "info2": "Antes de modificar la configuración de la base de datos, se recomienda utilizar la función de copia de seguridad de O2OA (ctl -dd) para realizar una copia de seguridad de los datos del sistema. Después de modificar la configuración de la base de datos, reinicie el servidor y luego restaure los datos de copia de seguridad en la base de datos (ctl -rd). Se debe reiniciar el servidor para cualquier cambio relacionado con la base de datos.",

        "innerDataSources": "Base de datos integrada",
        "externalDataSources": "Base de datos externa",
        "innerDataSourcesInfo": "La base de datos integrada de O2OA es una base de datos de memoria incrustada adecuada para entornos de desarrollo y demostración.",
        "externalDataSourcesInfo": "O2OA admite la extensión de bases de datos externas. Se recomienda utilizar una base de datos comercial en entornos de producción para garantizar la seguridad y el rendimiento de los datos.",

        "addDatabaseConfig": "Agregar configuración de base de datos",

        "databaseUrl": "Conexión de la base de datos",
        "enable": "Habilitar",
        "username": "Nombre de usuario",
        "password": "Contraseña",

        "tcpPort": "Puerto de conexión",
        "tcpPortInfo": "Puerto de conexión jdbc de la base de datos. El nombre de usuario es 'sa' y la contraseña es la misma que la contraseña de xadmin. La base de datos se crea en /o2server/local/repository/data/X.mv.db. Una vez que se crea el archivo de la base de datos, se crea la contraseña de la base de datos.",
        "webPort": "Puerto web",
        "webPortInfo": "H2 proporciona un cliente web. Este puerto es el puerto de acceso del cliente web. El nombre de usuario es 'sa' y la contraseña es la contraseña inicial de la base de datos creada por xadmin.",
        "jmxEnable": "Habilitar JMX",
        "jmxEnableInfo": "Si se habilita, puede acceder a través del cliente JMX local. No se admite el cliente JMX remoto.",
        "cacheSize": "Tamaño de caché",
        "cacheSizeInfo": "Tamaño de memoria utilizado por H2 como caché, medido en MB. El valor predeterminado es 512 MB.",
        "logLevel": "Nivel de registro",
        "maxTotal": "Número máximo de conexiones",
        "maxIdle": "Número máximo de conexiones inactivas",
        "statEnable": "Habilitar estadísticas",
        "statFilter": "Método de estadísticas",
        "slowSqlMillis": "Milisegundos de SQL lento",
        "slowSqlMillisInfo": "Milisegundos de ejecución de SQL lento registrado por separado. El valor predeterminado es 2000 ms.",
        "lockTimeout": "Tiempo de espera de bloqueo (ms)",

        "inputDatabaseUrl": "Ingrese la conexión de la base de datos.",

        "entityConfig": "Asignación de almacenamiento de clase de entidad",
        "entityConfigInfo": "Si ha habilitado múltiples bases de datos, puede asignar la base de datos de almacenamiento de clases de entidad en el sistema para mejorar el rendimiento. <span style='color: red'>Debe asegurarse de haber asignado una base de datos de almacenamiento correspondiente para todas las clases de entidades.</span>",

        "oneDatabase": "Para asignar una base de datos de almacenamiento para las clases de entidades en el sistema, debe habilitar dos o más bases de datos. Actualmente solo tiene una base de datos habilitada.",
        "oneDatabaseInfo": "Para asignar una base de datos de almacenamiento para las clases de entidades en el sistema, debe habilitar dos o más bases de datos.",


        "includeEntity": "Clases de entidad permitidas",
        "includeEntityInfo": "Las clases de entidad permitidas para almacenar en esta base de datos. Si está vacío, se permiten todas las clases de entidad. Use comas o saltos de línea para separar varias clases de entidad.",
        "excludeEntity": "Clases de entidad excluidas",
        "excludeEntityInfo": "Las clases de entidad que no se permiten almacenar en esta base de datos. Si está vacío, no se prohíbe ninguna clase de entidad. Use comas o saltos de línea para separar varias clases de entidad.",


        "editDatabase": "Editar configuración de base de datos",


        "saveDatabaseConfig": "Guardar todas las configuraciones de la base de datos",
        "saveDatabaseConfigInfo": "Las configuraciones en esta página no se guardarán automáticamente después de la modificación. Debe hacer clic en este botón para guardar las configuraciones modificadas.",
        "saveDatabaseConfirm": "Está a punto de guardar las configuraciones de la base de datos.<br><span style='color:red'> Esto puede afectar los datos existentes del sistema (incluidos los datos empresariales y de diseño).</span><br><br>¿Está seguro de que desea guardar la configuración de la base de datos?",

        "reloadDatabaseConfig": "Restaurar todas las configuraciones de la base de datos",
        "reloadDatabaseConfigInfo": "Si desea desechar los cambios no guardados en esta página, haga clic en este botón para volver a cargar la configuración.",
        "reloadDatabaseConfirm": "Esta acción volverá a cargar la configuración de la base de datos. Se perderán los cambios no guardados. ¿Está seguro de que desea restaurar la configuración de la base de datos?",

        "saveEntityConfig": "Guardar la configuración de la clase de entidad",
        "saveEntityConfirm": "Está a punto de guardar la configuración de la clase de entidad.<br><span style='color:red'> Esto puede afectar los datos existentes del sistema (incluidos los datos empresariales y de diseño).</span><br><br>¿Está seguro de que desea guardar la configuración de la clase de entidad?",
        "reloadEntityConfig": "Restaurar la configuración de la clase de entidad",
        "reloadEntityConfirm": "Esta acción volverá a cargar la configuración de la clase de entidad. Se perderán los cambios no guardados. ¿Está seguro de que desea restaurar la configuración de la clase de entidad?",

        "entityList": "Lista opcional",
        "selectedEntityList": "Lista seleccionada",
        "findClass": "Buscar nombre de clase",

        "removeDatabaseConfigTitle": "Confirmar",
        "removeDatabaseConfig": "<span style='color: red'>Nota: está a punto de eliminar la configuración de la base de datos: \"{name}\". Asegúrese de hacer una copia de seguridad de los datos del sistema antes de eliminar la base de datos.</span><br><br>¿Está seguro de que desea continuar?",

        "saveDatabaseConfigSuccess": "La configuración de la base de datos se ha guardado correctamente. Reinicie el servidor.",
        "saveEntityConfigSuccess": "La configuración de la clase de entidad se ha guardado correctamente. Reinicie el servidor.",

        "dumpRestoreTools": "Herramientas de copia de seguridad y restauración de bases de datos",
        "toolsInfo": "O2OA proporciona herramientas de copia de seguridad y restauración de datos. <span style='color: red'>En la mayoría de los casos, modificar la configuración de la base de datos afectará a los datos existentes del sistema</span>. Por lo tanto, antes de modificar la configuración de la base de datos, se recomienda que utilice la función de copia de seguridad de O2OA para hacer una copia de seguridad de los datos del sistema, modifique la configuración de la base de datos, reinicie el servidor y luego restaure los datos de la copia de seguridad en la base de datos.<br>" +
            "<span class='mainColor_color'>No cierre esta página mientras realiza la copia de seguridad o restauración de datos. Puede realizar otras operaciones en otra ventana del navegador.</span>",

        "dumpTools": "Copia de seguridad de datos",
        "dumpToolsInfo": "Haga clic en este botón para hacer una copia de seguridad de los datos. <span style='color: red'>No haga esto durante períodos frecuentes de lectura y escritura de datos del sistema.</span>",
        "dumpWaitLog": "La copia de seguridad de los datos no se ha realizado.",
        "dumpErrorLog": "Se produjo un error al realizar la copia de seguridad de los datos.",

        "dumpBegin": "Confirmación para comenzar la copia de seguridad",
        "dumpBeginInfo": "La copia de seguridad de los datos puede afectar el rendimiento del servidor. ¿Está seguro de que desea comenzar la copia de seguridad de los datos?",

        "dumpCheckButton": "Verificar el estado de la copia de seguridad",
        "dumpCheck": "Verificando el estado de la copia de seguridad ...",
        "dumpStop": "La copia de seguridad de los datos no se ha realizado.",
        "dumpRunning": "La copia de seguridad de los datos está en proceso ...",
        "dumpEnd": "La copia de seguridad de los datos se ha completado.",

        "restoreTools": "Restauración de datos",
        "restoreToolsInfo": "Haga clic en este botón para restaurar los datos. <span style='color: red'>No haga esto durante períodos frecuentes de lectura y escritura de datos del sistema.</span>",
        "restoreToolsInfo2": "Si su sistema contiene tablas de datos, después de la restauración de datos, debe compilar todas las tablas de datos en el centro de datos, realizar otra restauración de datos y luego reiniciar el servidor.",
        "restoreWaitLog": "La restauración de los datos no se ha realizado.",
        "restoreErrorLog": "Se produjo un error al restaurar los datos.",

        "restoreBegin": "Confirmación para comenzar la restauración de datos",
        "restoreBeginInfo": "La restauración de los datos puede afectar el rendimiento del servidor. ¿Está seguro de que desea comenzar la restauración de datos?",

        "restoreCheckButton": "Verificar el estado de la restauración",
        "restoreCheck": "Verificando el estado de la restauración ...",
        "restoreStop": "La restauración de los datos no se ha realizado.",
        "restoreRunning": "La restauración de los datos está en proceso ...",
        "restoreEnd": "La restauración de los datos se ha completado."


    },
    "_cloudConfig": {
        "info": "O2 Cloud Services proporciona numerosos servidores de valor agregado, como el mercado de aplicaciones, la ubicación de la oficina móvil, el servicio de mensajes y la conversión de documentos. Todo lo que necesita hacer es iniciar sesión en el servidor de O2 Cloud para utilizarlos.",
        "recheck": "Volver a verificar la conexión",

        "notValidatedInfo": "Inicie sesión en O2 Cloud para acceder al mercado de aplicaciones, conectarse a la aplicación móvil de la oficina y disfrutar de muchas funciones, como el servicio de mensajes y la conversión de documentos.",
        "disconnectInfo": "Su servidor no pudo conectarse a O2 Cloud. Verifique su entorno de red del servidor.",
        "validatedInfo": "<span style='color: #ff0000'>¡Hola!</span> {name}, Ha iniciado sesion en O2 Cloud y puede utilizar todas las funciones de la plataforma O2, incluyendo la oficina movil.",

        "connected": "¡Ya puedes conectarte a O2 Cloud!",
        "disconnect": "¡Tu servidor no se pudo conectar a O2 Cloud!",
        "notValidated": "¡Aún no has iniciado sesión en O2 Cloud!",
        "validated": "¡Has iniciado sesión en O2 Cloud!",

        "loginInfo": "Si ya tienes una cuenta de O2 Cloud, haz clic aquí para iniciar sesión:",
        "loginButtonText": "Iniciar sesión en O2 Cloud",
        "registerInfo": "Si no tienes una cuenta de O2 Cloud, haz clic aquí para registrarte:",
        "registerButtonText": "Registrar una cuenta de O2 Cloud",
        "forgotPasswordInfo": "Si olvidaste la contraseña de tu cuenta de O2 Cloud, haz clic aquí para restablecerla:",
        "forgotPasswordButtonText": "Restablecer la contraseña de O2 Cloud",

        "collectUsername": "Nombre de usuario de O2 Cloud",
        "collectPassword": "Contraseña de O2 Cloud",
        "collectMobile": "Número de teléfono móvil",
        "collectMail": "Dirección de correo electrónico",
        "collectCode": "Código de verificación",
        "collectConfirm": "Confirmar contraseña",
        "getCode": "Obtener código de verificación",
        "regetCode": "Obtener de nuevo",

        "inputCollectUsername": "Nombre de usuario de O2 Cloud",
        "inputCollectPassword": "Contraseña de O2 Cloud",
        "inputCollectMobile": "Número de teléfono móvil",
        "inputCollectMail": "Dirección de correo electrónico",
        "inputCollectCode": "Código de verificación de mensajes",
        "inputCollectConfirm": "Confirmar contraseña",
        "collectUsernameExist": "El nombre de usuario de O2 Cloud ya existe",
        "collectUsernameNotExist": "El nombre de usuario de O2 Cloud no existe",
        "passwordDisagree": "La confirmación de la contraseña no coincide",
        "mobileError": "El número de teléfono móvil ingresado no es correcto",
        "mailError": "La dirección de correo electrónico ingresada no es correcta",

        "registerCollect": "Registrar una cuenta de O2 Cloud",
        "forgotPassword": "¿Olvidaste la contraseña?",
        "loginError": "No se pudo iniciar sesión en O2 Cloud. Verifique el nombre de usuario y la contraseña de su cuenta.",
        "registerError": "Se produjo un error al registrar una cuenta de O2 Cloud. Póngase en contacto con el soporte técnico.",
        "deleteError": "Se produjo un error al eliminar una cuenta de O2 Cloud. Póngase en contacto con el soporte técnico.",
        "resetPasswordError": "Se produjo un error al modificar la contraseña de una cuenta de O2 Cloud. Póngase en contacto con el soporte técnico.",

        "deleteCollectUnit": "Eliminar una cuenta de O2 Cloud",
        "deleteCollectUnitInfo": "Está a punto de eliminar la cuenta de O2 Cloud: {name}. Ingrese su número de teléfono móvil y obtenga un código de verificación para confirmar.",

        "resetPasswordCollect": "Modificar la contraseña de una cuenta de O2 Cloud",

        "modifyCollect": "Modificar la cuenta",
        "logoutCollect": "Cerrar sesión",
        "modifyCollectPassword": "Modificar la contraseña",
        "deleteCollect": "Eliminar la cuenta",
        "reloginCollect": "Iniciar sesión nuevamente"
    },
    "_serversConfig": {
        "serverInfo": "Información del servidor",
        "baseConfig": "Configuración básica",
        "environmentConfig": "Configuración de variables de entorno",
        "sameConfig": "Usar la misma configuración del servidor",
        "sameConfigInfo": "O2OA tiene tres servidores lógicos: el servidor central, el servidor de aplicaciones y el servidor web. De forma predeterminada, utilizan el mismo puerto y la misma configuración. También puede configurar diferentes puertos, hosts, etc. para los tres servicios.",

        "serverConfig": "Configuración del servidor",
        "serverConfigInfo": "Configure aquí los parámetros relacionados con el servidor (se requiere reiniciar el servidor)",

        "serverPort": "Puerto del servicio",
        "serverPortInfo": "Puerto de escucha del servidor",

        "serverProxyHost": "Nombre de host",
        "serverProxyPort": "Puerto del host",
        "sslEnable": "Habilitar SSL",
        "httpProtocol": "Protocolo de acceso web",
        "sslKeyStorePassword": "Contraseña SSL",
        "sslKeyManagerPassword": "Contraseña de administrador SSL",
        "sslInfo": "<span> Para habilitar SSL, debe copiar el archivo de certificado solicitado en el directorio de configuración del servidor O2OA y cambiarle el nombre a `keystore`. En un entorno de clúster, debe almacenar el archivo de certificado en cada servidor. (Se requiere reiniciar el servidor)</span>",

        "saveServerConfig": "Guardar la configuración del servidor",
        "saveServerConfigSuccess": "La configuración del servidor se ha guardado correctamente",
        "saveServerConfigPortError": "Los puertos para el servidor central, de aplicaciones y web deben ser todos iguales o todos diferentes",

        "saveServerSSLConfig": "Guardar la configuración de SSL",
        "saveServerSSLConfigSuccess": "La configuración de SSL se ha guardado correctamente",

        "sslConfig": "¿Habilitar SSL?",

        "serverTaskConfig": "Tareas del servidor",

        "proxyCenterEnable": "Servicio proxy del centro",
        "proxyApplicationEnable": "Servicio proxy de aplicaciones",
        "proxyTimeOut": "Tiempo de espera del servicio proxy (en segundos)",

        "includes": "Módulos de aplicación habilitados",
        "includesInfo": "Puede seleccionar los módulos de aplicación que se permiten ejecutar en el servidor. Solo se iniciarán los módulos de aplicación configurados aquí, lo que permite una asignación más flexible del rendimiento del servidor en un entorno de clúster. Sin embargo, tenga cuidado al modificar esta configuración, ya que puede provocar errores en el servicio (se requiere reiniciar el servidor).",
        "includesInfo2": "<b style='color: #666666'>Seleccione los módulos integrados para habilitar:</b> Si no ha seleccionado ningún módulo, se habilitarán todos los módulos.",
        "includesInfo3": "<b style='color: #666666'>Apliacaciones personalizadas para habilitar:</b> Ingrese el nombre de la aplicación personalizada en el cuadro de entrada a continuación, separado por comas.",

        "saveIncludes": "Guardar la configuración de los módulos de aplicación habilitados",
        "saveExcludes": "Guardar la configuración de los módulos de aplicación deshabilitados",

        "excludes": "Módulos de aplicación deshabilitados",
        "excludesInfo": "Puede seleccionar los módulos de aplicación que se prohíben ejecutar en el servidor. No se iniciarán los módulos de aplicación configurados aquí, lo que permite una asignación más flexible del rendimiento del servidor en un entorno de clúster. Sin embargo, tenga cuidado al modificar esta configuración, ya que puede provocar errores en el servicio (se requiere reiniciar el servidor).",
        "excludesInfo2": "<b style='color: #666666'>Seleccione los módulos integrados para deshabilitar:</b> Si no ha seleccionado ningún módulo, no se deshabilitará ninguno.",
        "excludesInfo3": "<b style='color: #666666'>Apliacaciones personalizadas para deshabilitar:</b> Ingrese el nombre de la aplicación personalizada en el cuadro de entrada a continuación, separado por comas.",

        "includesAll": "Habilitar todos los módulos",
        "includesSelect": "Seleccione los módulos que desea habilitar",
        "includesModules": "Módulos habilitados",
        "selectModules": "Módulos disponibles",

        "excludesNone": "No se deshabilita ningún módulo",
        "excludesSelect": "Seleccione los módulos que desea deshabilitar",

        "saveServerIncludesSuccess": "La configuración de los módulos de aplicación habilitados se ha guardado correctamente",
        "saveServerExcludesSuccess": "La configuración de los módulos de aplicación deshabilitados se ha guardado correctamente",

        "requestLogEnable": "Habilitar registro HTTP",
        "requestLogBodyEnable": "Registrar contenido del cuerpo (body)",
        "requestLogRetainDays": "Días de retención de registro",
        "requestLogInfo": "Configure aquí el registro HTTP del servidor (se requiere reiniciar el servidor):" +
            "<ul><li>Después de habilitar el registro HTTP, los archivos de registro se guardan en el directorio 'logs' del servidor. (Cuando se habilita la administración de tres roles, el registro HTTP siempre está habilitado)</li>" +
            "<li>El registro del contenido del cuerpo (body) proporcionará información de registro más detallada, pero también aumentará significativamente el uso de espacio en disco y el costo del servidor.</li>" +
            "<li>Establezca el número de días que desea mantener los archivos de registro. Los archivos de registro antiguos se eliminarán automáticamente después de este tiempo.</li></ul>",

        "webSocketEnable": "¿Habilitar WebSocket?",
        "webSocketEnableInfo": "WebSocket se utiliza para funciones como notificaciones de mensajes y chat entre el servidor y los usuarios de WEB. Si habilita WebSocket, configure adecuadamente NGINX, WAF u otros sistemas de red para permitir la comunicación a través del protocolo WebSocket.(se requiere reiniciar el servidor)",

        "deployWarEnable": "¿Permitir implementar aplicaciones personalizadas en el lado del cliente?",
        "deployWarEnableInfo": "Esta configuración controla si las aplicaciones personalizadas (war) están permitidas para cargarse y desplegarse en el lado del cliente (WEB). (Se requiere reiniciar el servidor)",

        "deployResourceEnable": "¿Permitir implementar recursos web en el lado del cliente?",
        "deployResourceEnableInfo": "Esta configuración controla si los componentes y recursos estáticos del front-end están permitidos para cargarse y desplegarse en el lado del cliente (WEB). (Se requiere reiniciar el servidor)",

        "statEnable": "Habilitar estadísticas de Druid",
        "statExclusions": "Rutas excluidas de la estadística",
        "statEnableInfo": "¿Desea habilitar las estadísticas de Druid para conexiones de base de datos, ejecución de SQL, solicitudes HTTP y otra información relacionada? Puede acceder a los resultados de la estadística en la página de monitoreo de Druid mediante la URL: <a href='{url}' target='_blank'>Druid Monitor</a>.",

        "exposeJest": "¿Mostrar página de documentación de API Restful?",
        "exposeJestInfo": "Si habilita la muestra de documentación de la API Restful, puede acceder a ella mediante la URL: <a href='{url}' target='_blank'>API Restful</a>.",

        "scriptingBlockedClasses": "Clases de Java deshabilitadas para scripts del servidor",
        "scriptingBlockedClassesInfo": "Puede configurar las clases de Java que no se permiten utilizar en los scripts del servidor aquí. Separe las clases con comas.",

        "refererHeadCheckRegular": "Validación del encabezado Referer en las solicitudes",
        "refererHeadCheckRegularInfo": "Configure aquí la regla de validación para el encabezado Referer en las solicitudes. Solo se permitirán las solicitudes cuyo valor de Referer pase la validación del patrón regular configurado aquí. Una configuración razonable de esta opción puede ayudar a prevenir ataques CSRF. Por ejemplo, si configura (.+?)o2oa.net(.+?), solo se permitirán las solicitudes que tengan 'o2oa.net' en su campo Referer.",

        "accessControlAllowOrigin": "Permitir origen de solicitudes cruzadas (CORS)",
        "accessControlAllowOriginInfo": "Configurar la marca Access-Control-Allow-Origin en las respuestas http para permitir solicitudes CORS. Por ejemplo: https://www.o2oa.net",

        "personUnitOrderByAsc": "Ordenar personas y organizaciones en orden ascendente",
        "personUnitOrderByAscInfo": "¿Desea ordenar los datos de personas y organizaciones en orden ascendente al mostrarlos? El valor predeterminado es 'true'. Si lo configura como 'false', se ordenarán en orden descendente.",

        "attachmentConfig": "Configuración de carga de archivos adjuntos",
        "attachmentConfigInfo": "Puede configurar aquí el tamaño y los tipos de archivo que se permiten subir en el sistema.",

        "fileSize": "Límite de tamaño de archivo adjunto",
        "fileSizeInfo": "El tamaño máximo es de 2048MB (megabytes) medido en megabytes.",
        "fileTypeIncludes": "Tipos de archivo adjunto permitidos para la carga",
        "fileTypeIncludesInfo": "Configure aquí los tipos de archivo adjunto que se permiten cargar. Especificar las extensiones de archivo separadas por comas.",
        "fileTypeExcludes": "Tipos de archivo adjunto prohibidos para la carga",
        "fileTypeExcludesInfo": "Configure aquí los tipos de archivo adjunto que no se permiten cargar. Especificar las extensiones de archivo separadas por comas.",

        "dumpData": "Copia de seguridad automática de datos",
        "dumpDataInfo": "O2OA admite la copia de seguridad automática de datos programada. Configure aquí.",
        "dumpEnable": "¿Habilitar?",
        "dumpCron": "Expresión cron",
        "dumpSize": "Número máximo de copias de seguridad",
        "dumpPath": "Ruta de almacenamiento de copias de seguridad",
        "saveDump": "Guardar configuración de copia de seguridad automática",
        "saveDumpSuccess": "Configuración de copia de seguridad automática guardada con éxito.",


        "restoreData": "Restauración automática de datos",
        "restoreDataInfo": "O2OA admite la restauración automática de datos programada. Configure aquí.",
        "restoreEnable": "¿Habilitar?",
        "restoreCron": "Expresión cron",
        "restorePath": "Ruta de almacenamiento de datos a restaurar",
        "saveRestore": "Guardar configuración de restauración automática",
        "saveRestoreSuccess": "Configuración de restauración automática guardada con éxito.",

        "reloadServerConfig": "Recargar configuración del servidor."
    },
    "_worktimeConfig": {
        "amWorktime": "Hora de trabajo por la mañana",
        "pmWorktime": "Hora de trabajo por la tarde",
        "holidays": "Días festivos",
        "workdays": "Días laborables",
        "weekends": "Fines de semana",

        "amWorktimeInfo": "Configure aquí el rango horario de trabajo por las mañanas en días laborables.",
        "pmWorktimeInfo": "Configure aquí el rango horario de trabajo por las tardes en días laborables.",
        "holidaysInfo": "Configure los días festivos aquí. Agregue los días que originalmente eran días laborables como días festivos.",
        "workdaysInfo": "Configure los días laborales aquí. Agregue los días que originalmente no eran días laborales como días laborables.",
        "weekendsInfo": "Configure los fines de semana aquí. Seleccione los días que se consideran fines de semana y no son días laborables.",

        "timeRangeTo": "a",
        "startTime": "Hora de inicio",
        "endTime": "Hora de finalización",

        "weekData": {
            "Monday": 2,
            "Tuesday": 3,
            "Wednesday": 4,
            "Thursday": 5,
            "Friday": 6,
            "Saturday": 7,
            "Sunday": 1
        }
    },
    "_cacheConfig": {
        "type": "Tipo de caché",
        "typeInfo": "O2OA admite dos tipos de caché: guava y redis. El valor predeterminado es guava.",

        "guava_maximumSize": "Tamaño máximo del caché",
        "guava_maximumSizeInfo": "Número máximo de objetos que se pueden almacenar en el caché. Valor predeterminado: 3000.",
        "guava_expireMinutes": "Tiempo de vencimiento",
        "guava_expireMinutesInfo": "Tiempo de vencimiento del caché, medido en minutos. Valor predeterminado: 30.",

        "redis": "Configuración del servicio Redis",
        "redisInfo": "Configure aquí el servicio Redis.",
        "redis_host": "Dirección del servidor",
        "redis_port": "Puerto del servidor",
        "redis_user": "Usuario de autenticación",
        "redis_password": "Contraseña de autenticación",
        "redis_connectionTimeout": "Tiempo límite para establecer una conexión",
        "redis_socketTimeout": "Tiempo límite para recibir una respuesta del servidor",
        "redis_sslEnable": "Habilitar SSL",
        "redis_index": "Número de base de datos",

        "saveRedis": "Guardar configuración de Redis",
        "saveRedisSuccess": "Configuración de Redis guardada con éxito."
    },
    "_processConfig": {
        "baseConfig": "Configuración básica",
        "timerConfig": "Temporizador",

        "maintenanceIdentity": "Identidad de mantenimiento del flujo de trabajo.",
        "selectMaintenanceIdentity": "Seleccione la identidad de mantenimiento del flujo de trabajo.",
        "maintenanceIdentityInfo": "Si ocurre un error inesperado en el proceso de trabajo y no se puede encontrar al procesador correspondiente, el sistema primero intentará asignar el trabajo a la identidad del creador. Si no se puede obtener la identidad del creador, el trabajo se asignará a la identidad que se establece aquí.",

        "formVersionCount": "Número máximo de versiones de historial de formularios",
        "formVersionCountInfo": "Cada vez que se guarda un formulario, el sistema puede guardar una copia como una versión histórica para recuperar diseños anteriores en casos especiales. Configure aquí el número máximo de versiones históricas que se pueden guardar. Si se supera este número, se eliminará la versión más antigua del historial.",

        "processVersionCount": "Número máximo de versiones de historial de flujo de trabajo",
        "processVersionCountInfo": "Cada vez que se guarda un flujo de trabajo, el sistema puede guardar una copia como una versión histórica para recuperar diseños anteriores en casos especiales. Configure aquí el número máximo de versiones históricas que se pueden guardar. Si se supera este número, se eliminará la versión más antigua del historial.",

        "scriptVersionCount": "Número máximo de versiones de historial de scripts",
        "scriptVersionCountInfo": "Cada vez que se guarda un script, el sistema puede guardar una copia como una versión histórica para recuperar diseños anteriores en casos especiales. Configure aquí el número máximo de versiones históricas que se pueden guardar. Si se supera este número, se eliminará la versión más antigua del historial.",

        "docToWordType": "Método de conversión a WORD del componente del editor de documentos.",
        "docToWordTypeInfo": "Cuando configura el método de conversión a WORD del componente del editor de documentos como 'Servicio', el servidor realiza la conversión a WORD. O2OA admite la conversión local o la conversión en la nube. La conversión en la nube proporciona una mejor compatibilidad con el formato WORD, pero primero debe conectarse al servicio O2Cloud. Conéctese a O2Cloud en 'Configuración del servicio en la nube'.",
        "docWordTypeSelect": {
            "local": "Servicio local",
            "cloud": "Servicio en la nube"
        },

        "press": "Configuración de recordatorios de trabajo",
        "pressInfo": "Los nodos de actividad manual en la configuración del flujo de trabajo pueden establecerse para permitir recordatorios, lo que permite a las personas que han procesado un trabajo enviar recordatorios al actual procesador del trabajo. Puede establecer aquí el límite en el número de veces que se puede realizar esta acción dentro de un período de tiempo.",
        "pressInfo1": "En un plazo de",
        "pressInfo2": "minutos, como máximo",
        "pressInfo3": "recordatorios.",

        "executorCount": "Número de ejecutores de circulación",
        "executorCountInfo": "El número de ejecutores de circulación que procesan la circulación de flujo de trabajo. El valor predeterminado es 32 y generalmente no se recomienda modificarlo.",

        "executorQueueBusyThreshold": "Umbral de ocupación de cola de ejecutores",
        "executorQueueBusyThresholdInfo": "El umbral de ocupación de la cola de ejecutores que procesa la circulación de flujo de trabajo. El valor predeterminado es 5 y generalmente no se recomienda modificarlo.",

        "timerInfo": "La plataforma de flujo de trabajo O2OA requiere algunos temporizadores para procesar tareas de flujo de trabajo. Puede configurar estos temporizadores aquí. (Todos los cambios en los temporizadores requerirán un reinicio del servidor para que surtan efecto.)",

        "enable": "Habilitar",
        "cron": "Expresión cron",
        "urge": "Temporizador de recordatorio",
        "urgeInfo": "Si se establece un tiempo de espera para una actividad, este temporizador comprueba las tareas pendientes que están próximas a alcanzar el tiempo límite y envía un mensaje de recordatorio al procesador de la tarea.",

        "expire": "Temporizador de tiempo de espera",
        "expireInfo": "Si se establece un tiempo de espera para una actividad, este temporizador comprueba si las tareas pendientes han superado el tiempo límite y marca estas tareas como vencidas.",

        "touchDelay": "Temporizador de activación de actividad programada",
        "touchDelayInfo": "Este temporizador se utiliza para activar actividades programadas en el flujo de trabajo.",

        "deleteDraft": "Temporizador de eliminación de borradores",
        "deleteDraftInfo": "En el flujo de trabajo, se puede utilizar el modo de borrador para crear instancias de flujo de trabajo. Este modo no inicia formalmente el flujo de trabajo antes de guardarlo. Este temporizador se utiliza para eliminar los archivos de borrador que no se han circulado durante mucho tiempo.",

        "thresholdMinutes": "Umbral de tiempo (minutos)",
        "thresholdMinutesInfo": "Establezca el umbral, en minutos. Si transcurre más tiempo que este umbral, se considera que el borrador se puede eliminar. El valor predeterminado es de 10 días.",

        "passExpired": "Temporizador de circulación automática",
        "passExpiredInfo": "Si se habilita el procesamiento de tiempo de espera para una actividad de flujo de trabajo, este temporizador circula automáticamente las tareas pendientes que han superado el tiempo límite.",

        "touchDetained": "Temporizador de comprobación de tareas pendientes retenidas.",
        "touchDetainedInfo": "Este temporizador busca tareas pendientes que se han retenido durante mucho tiempo e intenta activar estas tareas para su circulación. Esto puede solucionar automáticamente problemas de retención de trabajos causados por cambios de personal, etc.",
        "thresholdMinutesInfo_touchDetained": "Este temporizador procesará tareas pendientes que hayan estado retenidas durante más tiempo que este umbral. El valor predeterminado es de 1440 minutos (1 día).",

        "updateTable": "Temporizador de sincronización con tabla de datos",
        "updateTableInfo": "Si se ha configurado la asignación de datos del flujo de trabajo a una tabla de datos, este temporizador se utiliza para procesar la cola de asignación de datos.",

        "archiveHadoop": "Archivar en Hadoop",
        "archiveHadoopInfo": "O2OA admite la archivación de datos de trabajos completados en Hadoop. Puede configurar la conexión a Hadoop aquí.",
        "fsDefaultFS": "Dirección de Hadoop",
        "username": "Nombre de usuario de Hadoop",
        "path": "Prefijo de ruta",
        "saveHadoop": "Guardar configuración de Hadoop",
        "saveHadooping": "Guardando ...",
        "saveHadoopSuccess": "Guardado correctamente",

        "merge": "Temporizador de archivación",
        "mergeInfo": ""
    },
    "_queryConfig": {
        "queryIndexConfig": "Configuración de índice",
        "workConfig": "En proceso",
        "workCompletedConfig": "Completados",
        "documentConfig": "Gestión de contenido",
        "indexTools": "Herramientas de índice",

        "work": "En proceso",
        "workCompleted": "Completados",
        "document": "Gestión de contenido",

        "touchWorkIndex": "Ejecutar índice completo en documentos en proceso",
        "touchWorkIndexInfo": "Si está habilitando el índice por primera vez o actualizando desde una versión anterior, puede iniciar inmediatamente un índice completo en los documentos en proceso cuando el sistema esté inactivo.",
        "touchWorkIndexAction": "Ejecutar índice completo en documentos en proceso de inmediato",

        "touchWorkCompletedIndex": "Ejecutar índice completo en documentos completados",
        "touchWorkCompletedIndexInfo": "Si está habilitando el índice por primera vez o actualizando desde una versión anterior, puede iniciar inmediatamente un índice completo en los documentos completados cuando el sistema esté inactivo.",
        "touchWorkCompletedIndexAction": "Ejecutar índice completo en documentos completados de inmediato",

        "touchDocumentIndex": "Ejecutar índice completo en documentos de gestión de contenido",
        "touchDocumentIndexInfo": "Si está habilitando el índice por primera vez o actualizando desde una versión anterior, puede iniciar inmediatamente un índice completo en los documentos de gestión de contenido cuando el sistema esté inactivo.",
        "touchDocumentIndexAction": "Ejecutar índice completo en documentos de gestión de contenido de inmediato",

        "optimizeIndex": "Ejecutar optimización de índice",
        "optimizeIndexInfo": "La optimización del índice puede comprimir el espacio de almacenamiento del índice y mejorar la estructura del índice para mejorar el rendimiento de la búsqueda. La optimización del índice puede tardar mucho tiempo, por lo que se recomienda ejecutarla cuando el sistema esté inactivo.",
        "optimizeIndexAction": "Ejecutar optimización de índice de inmediato",

        "indexActionConfirmTitle": "Confirmación",
        "indexActionConfirm": "El índice completo utiliza muchos recursos del servidor y puede afectar la respuesta del servidor. Se recomienda ejecutarlo cuando el sistema esté inactivo. <br><br> ¿Desea ejecutar un índice completo en los documentos {type} de inmediato?",
        "indexActionSuccess": "La tarea de índice completo en {type} se ha agregado a la cola y se ejecutará de inmediato.",

        "optimizeIndexConfirmTitle": "Confirmación",
        "optimizeIndexConfirm": "La optimización del índice utiliza muchos recursos del servidor y puede afectar la respuesta del servidor. Se recomienda ejecutarla cuando el sistema esté inactivo. <br><br> ¿Desea ejecutar la optimización de índice de inmediato?",
        "optimizeIndexSuccess": "La tarea de optimización de índice se ha agregado a la cola y se ejecutará de inmediato.",

        "restartServerInfo": "<span style='color: red'>Los cambios en la configuración del índice se aplicarán después de reiniciar el servidor.</span>",

        "enable": "Activar servicio de índice",

        "modeConfig": "Ubicación de almacenamiento del índice",
        "modeConfigInfo": "Seleccione la ubicación de almacenamiento del índice. El valor predeterminado es 'sistema de archivos local'.",
        "indexMode": "Ubicación de almacenamiento del índice",
        "modeOptions": {
            "localDirectory": "Sistema de archivos local",
            "hdfsDirectory": "Sistema de archivos HDFS",
            "sharedDirectory": "Sistema de archivos compartido"
        },
        "hdfsDirectoryDefaultFS": "Dirección del sistema de archivos HDFS",
        "hdfsDirectoryPath": "Directorio del sistema de archivos HDFS",
        "sharedDirectoryPath": "Directorio del sistema de archivos compartido",

        "optimizeIndexEnable": "Optimización de índice",
        "optimizeIndexEnableInfo": "La optimización del índice puede comprimir el espacio de almacenamiento del índice y mejorar la estructura del índice para mejorar el rendimiento de la búsqueda.",
        "optimizeIndexCron": "Configuración programada de optimización de índice",
        "isEnable": "Activar",
        "cron": "Expresión cron",

        "dataStringThreshold": "Umbral máximo de longitud de texto de datos comerciales",
        "dataStringThresholdInfo": "Umbral máximo de longitud de texto de datos comerciales. Se ignorarán los textos que superen este umbral y no se escribirán en el índice.",

        "summaryLength": "Longitud del resumen",

        "attachmentMaxSize":"Umbral de índice de archivo adjunto",
        "attachmentMaxSizeInfo":"Umbral de índice de archivo adjunto (MB). Si un archivo adjunto es más grande que este valor, no se indexará.",

        "cleanupThresholdDays": "Umbral de limpieza del contenido de búsqueda",
        "cleanupThresholdDaysInfo": "Umbral de limpieza del contenido de búsqueda (días). Los índices que no se han actualizado durante más días que este umbral se eliminarán.",

        "searchMaxPageSize": "Número máximo de resultados por página de búsqueda",
        "searchMaxPageSizeInfo": "El número máximo de resultados que se mostrarán en cada página de resultados de búsqueda.",

        "moreLikeThisMaxSize": "Número máximo de documentos relacionados en la búsqueda",
        "moreLikeThisMaxSizeInfo": "El número máximo de documentos relacionados que se mostrarán en una búsqueda.",

        "workIndexAttachment": "Índice de archivos adjuntos en documentos en proceso",
        "workIndexAttachmentInfo": "Activar o desactivar el índice de archivos adjuntos en los documentos en proceso. El índice de archivos adjuntos puede requerir un servidor más potente y más memoria dependiendo del volumen de negocios.",

        "lowFreqWorkEnable": "Activar índice completo",
        "lowFreqWorkEnableInfo": "El índice completo actualizará todos los índices de los documentos que están en flujo, para garantizar la precisión de los datos y los permisos.",
        "lowFreqWorkCron": "Expresión cron del índice completo programado",
        "lowFreqWorkCronInfo": "El índice completo utiliza muchos recursos del servidor. Si lo activa, se recomienda ejecutarlo solo en momentos de inactividad del sistema. Tenga en cuenta que para los documentos en proceso, los documentos completados y los datos de gestión de contenido, se recomienda ejecutar el índice completo en diferentes intervalos de tiempo.",
        "lowFreqWorkMaxCount": "Máximo número de documentos procesados en una vez por el índice completo",
        "lowFreqWorkMaxCountInfo": "Establezca el número máximo de documentos que se procesarán en una sola ejecución del índice completo. Una vez que se hayan procesado este número de documentos, el índice se detendrá. La próxima vez que se ejecute el índice, continuará desde donde se detuvo en el documento anterior. El índice se detendrá si se cumple cualquiera de los dos criterios: el número máximo de documentos o el tiempo máximo de procesamiento.",
        "lowFreqWorkMaxMinutes": "Tiempo máximo de procesamiento (en minutos) para una sola ejecución del índice completo",

        "highFreqWorkEnable": "Activar índice incremental",
        "highFreqWorkEnableInfo": "Si activa el índice incremental, se enviará una señal cada vez que cambie el estado o los datos de un documento. El temporizador del índice incremental se ejecutará en intervalos regulares para actualizar los índices de los documentos afectados.",
        "highFreqWorkCron": "Expresión cron del temporizador del índice incremental",
        "highFreqWorkCronInfo": "El temporizador del índice incremental se ejecuta en intervalos regulares según esta expresión cron.",
        "highFreqWorkMaxCount": "Máximo número de documentos procesados en una vez por el índice incremental",
        "highFreqWorkMaxMinutes": "Tiempo máximo de procesamiento (en minutos) para una sola ejecución del índice incremental",


        "workCompletedIndexAttachment": "Índice de archivos adjuntos en documentos completados",
        "workCompletedIndexAttachmentInfo": "Activar o desactivar el índice de archivos adjuntos en los documentos completados. El índice de archivos adjuntos puede requerir un servidor más potente y más memoria dependiendo del volumen de negocios.",

        "lowFreqWorkCompletedEnable": "Activar índice completo para documentos completados",
        "lowFreqWorkCompletedEnableInfo": "El índice completo actualizará todos los índices de los documentos que han sido completados, para garantizar la precisión de los datos y los permisos.",
        "lowFreqWorkCompletedCron": "Expresión cron del índice completo programado para documentos completados",
        "lowFreqWorkCompletedCronInfo": "El índice completo utiliza muchos recursos del servidor. Si lo activa, se recomienda ejecutarlo solo en momentos de inactividad del sistema. Tenga en cuenta que para los documentos en proceso, los documentos completados y los datos de gestión de contenido, se recomienda ejecutar el índice completo en diferentes intervalos de tiempo.",
        "lowFreqWorkCompletedMaxCount": "Número máximo de documentos procesados por cada ejecución del índice completo",
        "lowFreqWorkCompletedMaxCountInfo": "Establezca el número máximo de documentos que se procesarán en una sola ejecución del índice completo. Una vez que se hayan procesado este número de documentos, el índice se detendrá. La próxima vez que se ejecute el índice, continuará desde donde se detuvo en el documento anterior. El índice se detendrá si se cumple cualquiera de los dos criterios: el número máximo de documentos o el tiempo máximo de procesamiento.",
        "lowFreqWorkCompletedMaxMinutes": "Duración de procesamiento por cada ejecución del índice completo (minutos)",

        "highFreqWorkCompletedEnable": "Activar índice incremental para documentos completados",
        "highFreqWorkCompletedEnableInfo": "Si activa el índice incremental, se enviará una señal cada vez que cambie el estado o los datos de un documento completado. El temporizador del índice incremental se ejecutará en intervalos regulares para actualizar los índices de los documentos afectados.",
        "highFreqWorkCompletedCron": "Expresión cron del temporizador del índice incremental para documentos completados",
        "highFreqWorkCompletedCronInfo": "El temporizador del índice incremental se ejecuta en intervalos regulares según esta expresión cron.",
        "highFreqWorkCompletedMaxCount": "Número máximo de documentos procesados por cada ejecución del índice incremental",
        "highFreqWorkCompletedMaxMinutes": "Duración máxima de procesamiento por cada ejecución del índice incremental (minutos)",


        "documentIndexAttachment": "Activar índice de archivos adjuntos para documentos de gestión de contenido",
        "documentIndexAttachmentInfo": "Activar o desactivar el índice de archivos adjuntos para los documentos de gestión de contenido completados. El índice de archivos adjuntos puede requerir un servidor más potente y más memoria dependiendo del volumen de negocios.",

        "lowFreqDocumentEnable": "Activar índice completo para documentos de gestión de contenido",
        "lowFreqDocumentEnableInfo": "El índice completo actualizará todos los índices de los documentos de gestión de contenido del tipo 'información', para garantizar la precisión de los datos y los permisos.",
        "lowFreqDocumentCron": "Expresión cron del índice completo programado para documentos de gestión de contenido",
        "lowFreqDocumentCronInfo": "El índice completo utiliza muchos recursos del servidor. Si lo activa, se recomienda ejecutarlo solo en momentos de inactividad del sistema. Tenga en cuenta que para los documentos en proceso, los documentos completados y los datos de gestión de contenido, se recomienda ejecutar el índice completo en diferentes intervalos de tiempo.",
        "lowFreqDocumentMaxCount": "Número máximo de documentos procesados por cada ejecución del índice completo",
        "lowFreqDocumentMaxCountInfo": "Establezca el número máximo de documentos que se procesarán en una sola ejecución del índice completo. Una vez que se hayan procesado este número de documentos, el índice se detendrá. La próxima vez que se ejecute el índice, continuará desde donde se detuvo en el documento anterior. El índice se detendrá si se cumple cualquiera de los dos criterios: el número máximo de documentos o el tiempo máximo de procesamiento.",
        "lowFreqDocumentMaxMinutes": "Duración de procesamiento por cada ejecución del índice completo (minutos)",

        "highFreqDocumentEnable": "Activar índice incremental para documentos de gestión de contenido",
        "highFreqDocumentEnableInfo": "Si activa el índice incremental, se enviará una señal cada vez que cambie el estado o los datos de un documento de gestión de contenido. El temporizador del índice incremental se ejecutará en intervalos regulares para actualizar los índices de los documentos afectados.",
        "highFreqDocumentCron": "Expresión cron del temporizador del índice incremental para documentos de gestión de contenido",
        "highFreqDocumentCronInfo": "El temporizador del índice incremental se ejecuta en intervalos regulares según esta expresión cron.",
        "highFreqDocumentMaxCount": "Número máximo de documentos procesados por cada ejecución del índice incremental",
        "highFreqDocumentMaxMinutes": "Duración máxima de procesamiento por cada ejecución del índice incremental (minutos)"

    },
    "_appConfig": {
        "connectConfig": "Conexión",
        "moduleConfig": "Módulos",
        "iconConfig": "Iconos",

        "cloudConnect": "Comprobación de conexión al servicio en la nube",
        "connectedInfo": "<span style='color:#5fbf78'>[Conectado al servicio en la nube de O2]</span>",
        "notConnectedInfo": "<span style='color:red'>[No conectado al servicio en la nube de O2]</span>, por favor, regístrese e inicie sesión en la página de Configuración de Servicio en la Nube",

        "httpProtocol": "Protocolo de acceso WEB",
        "httpProtocolInfo": "Seleccione si el acceso móvil al servicio del Centro utilizará HTTP o HTTPS",

        "centerServer": "Servidor central",
        "centerServerInfo": "La dirección IP o el nombre de dominio y el puerto para el servicio del servidor central.",

        "webServer": "Servidor WEB",
        "webServerInfo": "La dirección IP o el nombre de dominio y el puerto para el servicio del servidor web. Si el nombre de domino o la dirección IP están vacíos o son '127.0.0.1', se utilizará la dirección del servidor central.",

        "applicationServer": "Servidor de aplicaciones",
        "applicationServerInfo": "La dirección IP o el nombre de dominio y el puerto para el servicio del servidor de aplicaciones. Si el nombre de domino o la dirección IP están vacíos o son '127.0.0.1', se utilizará la dirección del servidor central.",

        "editServer": "Editar dirección del servidor",
        "host": "Nombre de dominio o dirección IP",
        "port": "Puerto",

        "connectTest": "Prueba de conexión móvil",
        "connectTestInfo": "Escanee el código QR con su teléfono móvil para verificar si puede conectarse al servidor desde una red externa.",
        "getQrcode": "Generar código QR para prueba de conexión",


        "mobileIndex": "Configuración de la página principal para el acceso móvil",
        "mobileIndexInfo": "Puede configurar la página principal del acceso móvil como estilo de aplicación predeterminado o especificar una página de portal.",

        "simpleMode": "Modo simple para acceso móvil",
        "simpleModeInfo": "Cuando se activa el modo simple para acceso móvil, solo se muestra la página principal y la página de configuración en el móvil.",

        "appIndexPage": "Configuración de la página móvil",
        "appIndexPageInfo": "Si se muestran varias configuraciones de página principal en el lado móvil",
        "appIndexPageHome": "Página de inicio",
        "appIndexPageIM": "Noticias",
        "appIndexPageContact": "Libreta de direcciones",
        "appIndexPageApp": "Aplicación",
        "appIndexPageSettings": "Configuración",

        "systemMessageSwitch": "Mostrar notificaciones del sistema",
        "systemMessageSwitchInfo": "Indica si las notificaciones del sistema se muestran en la lista de mensajes de la app móvil.",
        "systemMessageCanClickInfo": "Indica si las notificaciones del sistema pueden ser abiertas haciendo clic sobre ellas en la app móvil.",

        "contactPermissionView": "Vista de permisos de la libreta de direcciones para la app móvil",
        "contactPermissionViewInfo": "Necesita instalar la aplicación 'libreta de direcciones' desde la tienda de aplicaciones. La aplicación incluye la vista de configuración de permisos de la libreta de direcciones.",

        "appExitAlert": "Mensaje de salida de la app",
        "appExitAlertInfo": "Mensaje que aparecerá al cerrar la app. Si está vacío, no aparecerá ningún mensaje.",

        "nativeAppList": "Lista de aplicaciones",
        "nativeAppListInfo": "Puede habilitar o deshabilitar las aplicaciones en la app móvil aquí.",

        "imageNames": {
            "application_top": {"text": "Imagen en la parte superior de la página de la aplicación", "action": "ApplicationTop"},
            "index_bottom_menu_logo_blur": {"text": "Icono de navegación en la página principal (no seleccionado)", "action": "MenuLogoBlur"},
            "index_bottom_menu_logo_focus": {"text": "Icono de navegación en la página principal (seleccionado)", "action": "MenuLogoFocus"},
            "launch_logo": {"text": "Imagen del logo de inicio", "action": "LaunchLogo"},
            "login_avatar": {"text": "Imagen predeterminada para el avatar en la página de inicio de sesión", "action": "LoginAvatar"},
            "process_default": {"text": "Icono predeterminado del flujo de trabajo", "action": "ProcessDefault"},
            "setup_about_logo": {"text": "Icono de la página Acerca de", "action": "SetupAboutLogo"}
        },
        "imageSzie": "Tamaño de imagen",
        "changeImage": "Cambiar imagen",
        "defaultImage": "Imagen predeterminada",
        "defaultImageTitle": "Confirmación de imagen predeterminada",
        "defaultImageInfo": "¿Está seguro de que desea reemplazar {name} con la imagen predeterminada?"
    },
    "_integrationConfig": {
        "title": "Integración de aplicaciones móviles",
        
        "dingding": "DingTalk",
        "mPweixin": "Cuenta oficial de WeChat",
        "qiyeweixin": "WeChat Work",
        "weLink": "Huawei WeLink",
        "zhengwuDingding": "Zhejiang Government DingTalk",


        "enable": "¿Habilitar la integración de DingTalk?",
        "corpId": "CorpId de DingTalk",
        "agentId": "AgentId de DingTalk",
        "appKey": "Identificación única de la aplicación",
        "appSecret": "Clave secreta de la aplicación",
        "syncCron": "Sincronizar señal de verificación de devolución de llamada con tiempo",
        "forceSyncCron": "Sincronización forzada en tiempo",
        "oapiAddress": "Dirección del servidor API de DingTalk",
        "token": "Token de devolución de llamada",
        "encodingAesKey": "encodingAesKey de devolución de llamadas",
        "workUrl": "URL para abrir el trabajo de mensaje de DingTalk",
        "messageRedirectPortal": "Redirigir a portal después del procesamiento completado",
        "messageEnable": "¿Habilitar la notificación por mensajes?",
        "scanLoginEnable": "¿Habilitar inicio de sesión mediante escaneo de código DingTalk?",
        "scanLoginAppId": "AppId de inicio de sesión mediante escaneo de código DingTalk",
        "scanLoginAppSecret": "appSecret de inicio de sesión mediante escaneo de código de DingTalk",
        "attendanceSyncEnable": "¿Habilitar información de asistencia?",

        "enableInfo": "La plataforma de O2OA tiene aplicaciones móviles nativas desarrolladas para Android e IOS que se pueden integrar en DingTalk como miniaplicaciones, sincronizando la libreta de direcciones empresarial de DingTalk como estructura local de organización y personal, y puede enviar notificaciones directamente a DingTalk para recordatorios de mensajes. (Se requiere reinicio del servidor)",
        "enableInfo2": "<span class='mainColor_color'>Si O2OA se integra con éxito en DingTalk, O2OA automáticamente sincronizará todas las personas y organizaciones desde DingTalk. Todas las personas y organizaciones de O2OA se basarán en la estructura organizacional creada en DingTalk de la empresa (las personas y organizaciones creadas localmente no serán eliminadas y se mantendrán, lo que puede provocar duplicados).</span>",
        "enableInfo3": "Para obtener más información sobre la integración de O2OA y DingTalk, consulte: <a href='https://www.o2oa.net/search.html?q=%E9%92%89%E9%92%89' target='_blank'>钉钉</a>",

        "syncCronInfo": "Verificación de devolución de llamada que desencadena la verificación de sincronización, se ejecuta automáticamente cada 10 minutos de forma predeterminada. Si se recibe una señal de devolución de llamada de DingTalk durante este tiempo, se activará una tarea de sincronización para realizar la sincronización del personal. (Debe configurarse la devolución de llamada en DingTalk)",
        "forceSyncCronInfo": "Configuración de sincronización forzada programada, que realiza una sincronización forzada de personal y organización a las 8:00 y las 12:00 todos los días.",
        "oapiAddressInfo": "Dirección del servidor API de DingTalk, por lo general no es necesario modificarla.",
        "workUrlInfo": "URL de la dirección para abrir el trabajo de mensajes de DingTalk, como: https://sample.o2oa.net/x_desktop/",
        "messageRedirectPortalInfo": "Después de que se procese un mensaje de DingTalk, puede especificar la página del portal a la que se dirigirá.",

        "saveDingding": "Guardar configuración de DingTalk",
        "saveDingdingSuccess": "Configuración de DingTalk guardada correctamente.",

        "mpweixinText": {
            "enable": "¿Habilitar?",
            "enablePublish": "Habilitar la publicación de menús",
            "appid": "Appid de WeChat",
            "appSecret": "AppSecret de WeChat",
            "token": "Token de WeChat",
            "encodingAesKey": "encodingAesKey de WeChat",
            "portalId": "Redirigir a portal después del procesamiento completado",
            "workUrl": "URL para abrir el trabajo de mensaje de WeChat",
            "scriptId": "Ejecutar script de servicio",
            "messageEnable": "Habilitar mensaje de plantilla",
            "tempMessageId": "ID de mensaje de plantilla de cuenta oficial de WeChat",
            "fieldList": "Configuración de campo de plantilla",
            "tempName": "Campo de plantilla",
            "name": "Campo de negocio",

            "workUrlInfo": "Dirección URL para abrir el trabajo de mensajes de cuenta oficial de WeChat, como: https://sample.o2oa.net/x_desktop/",
            "enableInfo": "O2OA admite la integración con cuentas oficiales de WeChat, y los usuarios pueden procesar trabajos siguiendo la cuenta pública de WeChat, y admite notificaciones de mensajes para trabajos pendientes. (Se requiere reinicio del servidor)",
            "enableInfo2": "Para obtener más información sobre la integración de O2OA y cuentas oficiales de WeChat, consulte: <a href='https://www.o2oa.net/search.html?q=%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7' target='_blank'>微信公众号</a>",
            "enablePublishInfo": "Después de habilitar la publicación de menús, puede publicar las funciones de menú configuradas en O2OA en una cuenta oficial de WeChat. Puede configurar el menú de una cuenta oficial de WeChat en Configuración de menú público de APP.",
            "portalIdInfo": "Después de que se procese un mensaje, puede especificar la página del portal a la que se dirigirá.",
            "scriptIdInfo": "Cuando se recibe un mensaje de texto de una cuenta oficial de WeChat, se puede ejecutar una interfaz de administración de servicios de plataforma especificada aquí.",
            "fieldListInfo": "Esta es la relación correspondiente entre los campos empresariales en el contenido de la plantilla. Actualmente, O2OA proporciona los siguientes campos empresariales: [creatorPerson: creador, activityName: nodo actual, processName: nombre del proceso, startTime: hora de inicio, title: título].",

            "saveMpweixin": "Guardar configuración de cuenta oficial de WeChat",
            "saveMpweixinSuccess": "Configuración de cuenta oficial de WeChat guardada correctamente."
        },
        "qywenxinText": {
            "enable": "¿Habilitar?",
			"corpId": "CorpId de WeChat Enterprise",
			"agentId": "ID de agente de WeChat Enterprise",
			"corpSecret": "CorpSecret de WeChat Enterprise",
			"syncCron": "Sincronización de señal de verificación programada",
			"forceSyncCron": "Sincronización con fuerza programada",
			"apiAddress": "Dirección del servidor API",
			"syncSecret": "Clave secreta para sincronización de libreta de direcciones",
			"token": "Token de devolución de llamada",
			"encodingAesKey": "EncodingAesKey de devolución de llamada",
			"workUrl": "URL para abrir el trabajo de mensaje de WeChat Enterprise",
			"messageRedirectPortal": "Redirigir a portal después del procesamiento completado",
			"messageEnable": "¿Habilitar notificaciones de mensajes?",
			"scanLoginEnable": "¿Habilitar inicio de sesión mediante escaneo de código?",
			"attendanceSyncEnable": "¿Habilitar sincronización de información de asistencia?",
			"attendanceSyncAgentId": "ID de aplicación de marcaje de asistencia",
			"attendanceSyncSecret": "Secreto de aplicación de marcaje de asistencia",
            "bindEnable": "Si habilitar la vinculación del usuario",
            "bindEnableInfo": "¡¡ no lo active por defecto, esto es para usuarios vinculados privatizados y es mutuamente excluyente de las organizaciones de usuarios simultáneos!",

			"getUserPrivateInfoMessageTitle": "Enviar mensaje para obtener información privada personal de WeChat Enterprise",
			"getUserPrivateInfoMessageDesc": "La nueva versión de la API de sincronización de WeChat Enterprise limita la obtención de información privada del usuario (como número de teléfono, correo electrónico, etc.). En este momento, el programa de sincronización solo puede obtener el nombre y el userId del usuario. La función de envío de mensajes a continuación es para enviar un mensaje de autorización para obtener información privada. Después de que el usuario haga clic en este mensaje, este programa puede leer la información del usuario necesaria.",
			"getUserPrivateInfoMessageConsumerList": "Destinatarios del mensaje",
			"getUserPrivateInfoMessageFormTitle": "Título del mensaje",
			"getUserPrivateInfoMessageFormContent": "Contenido del mensaje",
			"getUserPrivateInfoMessageFormTitleDefault": "【Autorización para obtener información personal】",
			"getUserPrivateInfoMessageFormContentDefault": "La aplicación necesita obtener su información personal. ¡Haga clic en Autorizar!",
			"getUserPrivateInfoMessageConsumerEmpty": "¡Seleccione destinatarios del mensaje primero!",
			"getUserPrivateInfoMessageFormTitleEmpty": "¡El título del mensaje no puede estar vacío!",
			"getUserPrivateInfoMessageFormContentEmpty": "¡El contenido del mensaje no puede estar vacío!",
			"getUserPrivateInfoMessageConfirmTitle": "Advertencia",
			"getUserPrivateInfoMessageConfirmText": "¿Está seguro de que desea enviar un mensaje de WeChat Enterprise a todos los usuarios y organizaciones seleccionados para obtener información privada?",
			"getUserPrivateInfoMessageSendBtn": "Enviar mensaje",
			"getUserPrivateInfoMessageSendSuccess": "¡El envío del mensaje fue exitoso! Por favor revise en WeChat Enterprise.",


            "syncCronInfo": "Señal de devolución de llamada que activa la comprobación de sincronización. Se ejecuta automáticamente cada 10 minutos. Si se recibe una señal de devolución de llamada de WeChat Work durante este período, se activará la tarea de sincronización para sincronizar el personal. (Requiere configurar la configuración de devolución de llamada en WeChat Work)",
			"forceSyncCronInfo": "Configuración de sincronización forzada con temporizador. Por defecto, se fuerza la sincronización del personal y las organizaciones a las 8:00 a.m. y las 12:00 p.m. todos los días.",
			"apiAddressInfo": "Dirección del servidor API de WeChat Work, generalmente no es necesario modificarla.",
			"workUrlInfo": "La dirección URL para abrir mensajes de trabajo en WeChat Work, como: https://sample.o2oa.net/x_desktop/",
			"messageRedirectPortalInfo": "Después de procesar los mensajes de WeChat Work, puede especificar a qué página de portal redirigir.",

			"enableInfo": "O2OA soporta la integración en WeChat Work como una aplicación autoconstruida, sincronizando el libro de direcciones empresarial de WeChat Work como la estructura local de personal de la organización y también puede enviar notificaciones directamente a WeChat Work, como tareas, para recordatorios de mensajes.",
			"enableInfo2": "Para obtener más información sobre O2OA y WeChat Work, consulte: <a href='https://www.o2oa.net/search.html?q=%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1' target='_blank'>企业微信</a>",

			"saveText": "Guardar configuración de WeChat Work",
			"saveSuccess": "Configuración de WeChat Work guardada exitosamente."
        },
        "welinkText": {

            "enable": "¿Habilitar?",
			"clientId": "ClientId de la aplicación",
			"clientSecret": "ClientSecret de la aplicación",
			"syncCron": "Tiempo de comprobación de sincronización con señal de devolución de llamada",
			"forceSyncCron": "Configuración de sincronización forzada con temporizador",
			"oapiAddress": "Dirección del servicio API",
			"messageEnable": "¿Habilitar la notificación de mensajes?",
			"workUrl": "URL para abrir mensajes de trabajo",
			"messageRedirectPortal": "Redirigir al portal después del procesamiento",

			"enableInfo": "O2OA admite la integración en WeLink como una aplicación interna ligera de empresas Huawei, sincronizando el libro de direcciones de WeLink como la estructura local del personal de la organización y también puede enviar directamente notificaciones, como tareas, a WeLink para recordatorios de mensajes. (Requiere reiniciar el servidor)",
			"enableInfo2": "Para obtener más información sobre O2OA y WeLink, consulte: <a href='https://www.o2oa.net/search.html?q=welink' target='_blank'>WeLink</a>",

			"syncCronInfo": "La señal de devolución de llamada activa la comprobación de sincronización. Se ejecuta automáticamente cada 10 minutos. Si se recibe una señal de devolución de llamada de WeLink durante este período, se activará la tarea de sincronización para sincronizar el personal. (Requiere configurar la configuración de devolución de llamada en WeLink)",
			"forceSyncCronInfo": "Configuración de sincronización forzada con temporizador. Por defecto, se fuerza la sincronización del personal y las organizaciones a las 8:00 a.m. y las 12:00 p.m. todos los días.",

			"workUrlInfo": "La dirección URL para abrir mensajes de trabajo en WeLink, como: https://sample.o2oa.net/x_desktop/",
			"messageRedirectPortalInfo": "Después de procesar los mensajes de WeLink, puede especificar a qué página de portal redirigir.",

			"saveText": "Guardar configuración de WeLink",
			"saveSuccess": "Configuración de WeLink guardada exitosamente."
        }
    },
    "_storageServer": {
        "innerStorage": "Almacenamiento interno",
		"externalStorage": "Almacenamiento externo",

		"info": "<span style='color: red'>Modificar la configuración de almacenamiento afectará en la mayoría de los casos al almacenamiento de archivos existente del sistema. ¡Por favor, modifique esta configuración con cuidado!</span>",
		"info2": "Antes de modificar la configuración de almacenamiento, se recomienda que utilice la función de copia de seguridad de O2OA (ctl -dd) para hacer una copia de seguridad de los datos del sistema. Después de modificar la configuración de almacenamiento, reinicie el servidor y luego restaure los datos de la copia de seguridad (ctl -rd). Cualquier modificación de la configuración relacionada con la base de datos requiere que se reinicie el servidor.",

		"saveStorageConfig": "Guardar toda la configuración de almacenamiento",
		"saveStorageConfigInfo": "La configuración modificada en esta página no se guardará inmediatamente. Debe hacer clic en este botón para guardar las configuraciones que ha modificado.",
		"saveStorageConfirm": "Está a punto de guardar la configuración de almacenamiento<br><span style='color:red'> Esto podría afectar al almacenamiento de archivos existente en el sistema.</span><br><br> ¿Está seguro de querer guardar la configuración de almacenamiento?",

		"reloadStorageConfig": "Restaurar toda la configuración de almacenamiento",
		"reloadStorageConfigInfo": "Si desea descartar las modificaciones no guardadas en esta página, puede hacer clic en este botón para volver a cargar la configuración.",
		"reloadStorageConfirm": "Esta acción volverá a cargar la configuración de almacenamiento y se perderán las modificaciones no guardadas. ¿Está seguro de querer restaurar la configuración de almacenamiento?",

		"storageType": "Tipo de servicio de almacenamiento",
		"storageTypeInfo": "O2OA tiene un servicio de almacenamiento de archivos integrado y también puede utilizar nodos de almacenamiento externo según sea necesario.",
		"storageTypeData": [
			{"value": 'inner', "label": "inner", "text": "Servicio de almacenamiento interno"},
			{"value": 'external', "label": "external", "text": "Servicio de almacenamiento externo"}
		],

        "innerInnerInfo": "<span class='mainColor_color'>Está utilizando el servicio de almacenamiento de archivos integrado</span>, <span style='color:red'>asegúrese de configurar un nombre diferente para cada nodo de almacenamiento</span>",
		"innerExternalInfo": "<span class='mainColor_color'>Ha habilitado el servicio de almacenamiento de archivos externo</span>, pero aún puede modificar la configuración del servicio de almacenamiento de archivos integrado. <span style='color:red'>Asegúrese de configurar un nombre diferente para cada nodo de almacenamiento</span>",

		"innerStorageConfig": "Configuración de almacenamiento interno",

        "enable": "¿Habilitar?",
		"port": "Puerto",
		"name": "Nombre",
		"prefix": "Ruta del prefijo",
		"deepPath": "Usar ruta profunda",
		"saveStorage": "Guardar configuración de almacenamiento",
		"saveStorageSuccess": "Configuración de almacenamiento guardada con éxito",

		"externalInnerInfo": "<span class='mainColor_color'>Está utilizando el servicio de almacenamiento de archivos integrado</span>, pero aún puede modificar la configuración del servicio de almacenamiento de archivos externo.",
		"externalExternalInfo": "<span class='mainColor_color'>Ha habilitado el servicio de almacenamiento de archivos externo.</span>",

        "enableExternal": "Habilitar almacenamiento de archivos externo",
		"disableExternal": "Deshabilitar almacenamiento de archivos externo",
		"enableExternalInfo": "Si desea habilitar el almacenamiento de archivos externo, asegúrese de haber completado la configuración correspondiente. De lo contrario, el servidor puede sufrir problemas. Tanto habilitar como deshabilitar el servicio de almacenamiento externo afectará al almacenamiento de archivos existente en el sistema, por lo que se recomienda hacer una copia de seguridad de los datos del sistema antes de tomar cualquier acción.",

		"enableExternalTitle": "Confirmar la habilitación del almacenamiento de archivos externo",
		"enableExternalConfirm": "Está a punto de habilitar el almacenamiento de archivos externo y deshabilitar el servicio de almacenamiento de archivos integrado.<br><span style='color:red'> Esto podría afectar al almacenamiento de archivos existente en el sistema.</span><br><br> ¿Está seguro de querer habilitar el almacenamiento de archivos externo?",
		"disableExternalTitle": "Confirmar la deshabilitación del almacenamiento de archivos externo",
		"disableExternalConfirm": "Está a punto de deshabilitar el almacenamiento de archivos externo y habilitar el servicio de almacenamiento de archivos integrado.<br><span style='color:red'> Esto podría afectar al almacenamiento de archivos existente en el sistema.</span><br><br> ¿Está seguro de querer deshabilitar el almacenamiento de archivos externo?",

		"externalStorageNode": "Configuración del nodo de almacenamiento externo",
		"addStorageNode": "Agregar nodo de almacenamiento",
		"editStorageNode": "Editar nodo de almacenamiento",
		"inputStorageNodeKey": "Ingrese el identificador del nodo de almacenamiento",
		"inputStorageNodeName": "Ingrese el nombre del nodo de almacenamiento",

        "external": {
            "protocol": "Protocolo",
			"username": "Nombre de usuario",
			"password": "Contraseña",
			"host": "Host",
			"port": "Puerto",
			"name": "Nombre",
			"key": "Identificador del nodo",
			"protocolData": {
				"webdav": "WebDAV",
				"sftp": "SFTP",
				"ftps": "FTPS",
				"ftp": "FTP",
				"file": "Archivo",
				"hdfs": "HDFS",
				"cifs": "CIFS",
				"ali": "Almacenamiento en la nube de Alibaba",
				"s3":"Almacenamiento en la nube de Amazon",
				"min":"Almacenamiento MinIO"
			}
        },
        "removeNodeConfigTitle": "Confirmación",
		"removeNodeConfig": "Está a punto de eliminar el nodo de almacenamiento \"{name}\". Esta acción podría afectar al almacenamiento de archivos existente en el sistema.<br>¿Está seguro de querer eliminar el nodo de almacenamiento\"{name}\"?",

		"assignNode": "Asignación de nodos de almacenamiento",
		"assignNodeInfo": "En O2OA existen varios tipos de archivos y se pueden asignar nodos de almacenamiento a estos archivos. Cada tipo de archivo puede tener múltiples nodos de almacenamiento asignados.",
        "files": {
            "file": "Archivos de la nube (file)",
			"processPlatform": "Archivos de plataforma de flujo de trabajo (processPlatform)",
			"mind": "Archivos de mapas mentales (mind)",
			"meeting": "Archivos de gestión de reuniones (meeting)",
			"calendar": "Archivos de programación de calendario (calendar)",
			"cms": "Archivos de gestión de contenido (cms)",
			"bbs": "Archivos de gestión de foros (bbs)",
			"teamwork": "Archivos de gestión de trabajo (strategyDeploy)",
			"structure": "Archivos de gestión de aplicaciones (structure)",
			"im": "Archivos de chat (im)",
			"general": "Otros archivos generales (general)",
			"custom": "Archivos de aplicaciones personalizadas (custom)"
        },

        "store": "Nodo de almacenamiento",

		"noStoreNode": "No se han asignado nodos de almacenamiento",
		"addStore": "Agregar nodo de almacenamiento",
		"saveStore": "Guardar"

    },
    "_appTools": {
        "onlineBuild": "Generación de Aplic en línea",
		"mpweixinMenu": "Menú de cuenta pública",

		"onlineBuildInfo": "<ul style='padding: 0'><li>Actualmente, la función de generación de aplicaciones en línea solo es compatible con dispositivos Android.</li>" +
		"<li>Para usar la generación de aplicaciones en línea, primero debe registrarse e iniciar sesión en la [configuración de servicios en la nube].</li>" +
		"<li>Después de enviar la información, se mostrará el estado actual de generación de la aplicación. El proceso de generación puede llevar mucho tiempo. Puede salir de esta página y esperar a que se complete la generación antes de descargar el archivo APK en esta página.</li></ul>",

		"onlineBuildInfo1": "<span class='mainColor_color'>Ofrecemos una aplicación mejorada 'Generación de aplicaciones en línea' en la tienda de aplicaciones. Puede encontrarla allí para obtener más información.</span>",

        "appPack": {
            "formSubmitBtnTitle": "Enviar y comenzar a empaquetar",
			"formReinputBtnTitle": "Volver a completar el formulario y empaquetar",
			"formRePackBtnTitle": "Empaquetar con la información original",
			"formDownloadApkBtnTitle": "Descargar archivo APK",
			"formDownloadPublishBtnTitle": "Descargar publicación localmente",
			"refreshStatusBtnTitle": "Actualizar estado",
			"formUploadLogoBtnTitle": "Subir imagen",

			"messageO2cloudNotEnable": "¡O2 cloud no está habilitado o no se puede conectar!",
			"messageO2cloudNotLogin": "¡Inicie sesión en O2 cloud primero!",
			"messageO2cloudLoginFail": "¡Falló inicio de sesión en el servidor de empaquetamiento de aplicaciones!",
			"statusOrderInline": "En cola......",
			"statusPacking": "Empaquetando......",
			"statusPackEnd": "Empaquetado completo",
			"statusPackError": "Error al empaquetar",
			"publishStatusNone": "No publicado",
			"publishStatusDoing": "Publicando...",
			"publishStatusCompleted": "Publicación completa, ¡escanee el código QR en la pantalla de inicio de sesión para instalar la aplicación!",
			"publishStatusFail": "Error al publicar, por favor intente de nuevo o contacte al administrador.",
			"messageSubmitNotAtStatus": "¡Actualmente se está empacando, inténtelo más tarde!",
			"messageAppnameNotEmpty": "¡El nombre de la aplicación no puede estar vacío!",
			"messageAppnameLenMax6": "¡El nombre de la aplicación no puede tener más de 6 caracteres!",
			"messageAppLogoNotEmpty": "¡Cargue una imagen de logotipo válida!",
			"messageAppLogoNeedPng": "¡La imagen de logotipo debe estar en formato PNG!",
			"messagePortocolNotEmpty": "¡El protocolo HTTP no puede estar vacío!",
			"messageHostNotEmpty": "¡El nombre de dominio del servidor central no puede estar vacío!",
			"messageHostFormatError": "¡Ingrese el nombre de dominio o la dirección IP del servidor central, como www.o2oa.net, sin ningún prefijo http!",
			"messagePortNotEmpty": "¡El número de puerto del servidor central no puede estar vacío!",
			"messageContext_not_empty": "¡El contexto del servidor central no puede estar vacío!",
			"messagePortocolMustBeHttpHttps": "¡El protocolo HTTP solo puede ser http o https!",
			"messageAlertTitle": "Confirmación de envío",
			"messageAlertSubmit": "¿Está seguro de que desea enviar el formulario? ¡La información del formulario se empaquetará en una aplicación móvil!",

            "statusLabel": "Estado actual",
			"publishStatusLabel": "Estado de publicación",
			"formAppName": "Nombre de la aplicación",
			"formAppNameTip": "Nombre que se muestra en el escritorio de la aplicación, no más de 6 caracteres.",
			"formLogo": "Imagen del logotipo",
			"formLogoTip": "La imagen del logotipo que se muestra en el escritorio de la aplicación, debe estar en formato PNG.",
			"formProtocol": "Protocolo HTTP",
			"formProtocolTip": "http / https",
			"formHost": "Nombre de dominio",
			"formHostTip": "El nombre de dominio o dirección IP del servidor central, por ejemplo, www.o2oa.net.",
			"formPort": "Número de puerto",
			"formPortTip": "El número de puerto del servidor central, por ejemplo, 20030.",
			"formContext": "Contexto",
			"formContextTip": "El contexto del servidor central, por ejemplo, /x_program_center.",
			"formUrlMapping": "Mapeo de url proxy",
			"formUrlMappingTip": "Se utiliza cuando se utiliza una dirección proxy fuera del servidor. Por ejemplo, {\"demo.o2oa.net:20020\": \"demo.o2oa.net/dev/app\"}.",
			"formAppVersionName": "Nombre de la versión de la aplicación",
			"formAppVersionNameTip": "El nombre de la versión de la aplicación, por ejemplo v1.0.0. Este campo no es obligatorio.",
			"formAppBuildNo": "Número de versión de la aplicación",
			"formAppBuildNoTip": "El número de versión de la aplicación, debe ser un número entero positivo, por ejemplo 100. Este campo no es obligatorio.",
			"formEnableOuterPackage": "Habilitar nombre de paquete externo",
			"formEnableOuterPackageTip": "Habilitar el nombre de paquete externo puede evitar conflictos y reemplazos con aplicaciones publicadas oficialmente."
        },

        "mpMenu": {
            "mpweixinInfo": "⚠️ La función del menú de la cuenta pública de WeChat requiere que se habilite primero el archivo de configuración correspondiente [mpweixin.json] y se active la configuración del servidor en el módulo de desarrollo en el backend de administración de la cuenta pública de WeChat.",
			"mpweixin": "Cuenta pública",
			"publishMpweixin": "Publicar en la cuenta pública de WeChat",
			"publishToWxmp": "¡Atención! Esta acción sobrescribirá todos los datos de menú guardados en la cuenta pública de WeChat. ¿Desea continuar?",
			"publishSuccess": "¡Publicado con éxito! Los cambios se sincronizarán en la aplicación móvil dentro de las 24 horas.",
			"subscribeMpweixin": "Respuesta de suscripción",
			"subscribeMpweixin_desc": "El mensaje que se envía automáticamente cuando un nuevo usuario sigue la cuenta pública.",
			"subscribeContentErrorEmpty": "¡La respuesta del mensaje no puede estar vacía!",
			"subscribeMpweixin_save": "Guardar",
			"deleteMenuBtnTitle": "Eliminar menú",

			"defaultNewName": "Nuevo menú",
			"formNameLabel": "Nombre del menú",
			"formOrderLabel": "Número de orden del menú",
			"formRadioLabel": "Contenido del menú",
			"formRadioTypeMsg": "Enviar mensaje",
			"formRadioTypeUrl": "Redirigir a una página web",
			"formRadioTypeMiniprogram": "Redirigir a una mini aplicación",

            "formTypeMsgTips": "Cuando se hace clic en este menú, se enviará el siguiente mensaje de texto al usuario. Los números de cuenta de suscripción no autenticados no admiten mensajes de texto.",
			"formTypeMsgLabel": "Mensaje de texto",
			"formTypeMsgErrorEmpty": "¡El contenido del mensaje de texto no puede estar vacío!",
			"formSubscribeContentErrorEmpty": "¡El contenido de la respuesta del mensaje no puede estar vacío!",
			"formTypeUrlTips": "Cuando se hace clic en este menú, se redirigirá al siguiente enlace.",
			"formTypeUrlLabel": "Dirección de página",
			"formTypeUrlErrorEmpty": "¡La dirección de página no puede estar vacía!",
			"formTypeMiniprogramTips": "Cuando se hace clic en este menú, se redirigirá a la siguiente mini aplicación.",
			"formTypeMiniprogramAppidLabel": "ID de la mini aplicación",
			"formTypeMiniprogramAppidPlaceholder": "ID de mini aplicación, se puede encontrar en el backend de administración de mini aplicaciones de WeChat.",
			"formTypeMiniprogramAppidErrorEmpty": "¡El ID de la mini aplicación no puede estar vacío!",
			"formTypeMiniprogramPathLabel": "Ruta de la mini aplicación",
			"formTypeMiniprogramPathPlaceholder": "Ruta de la mini aplicación, se puede encontrar en el backend de administración de mini aplicaciones de WeChat.",
			"formTypeMiniprogramPathErrorEmpty": "¡La ruta de la mini aplicación no puede estar vacía!",
			"formTypeMiniprogramUrlLabel": "Página web de respaldo",
			"formTypeMiniprogramUrlPlaceholder": "Página web de respaldo, se abrirá en navegadores antiguos de WeChat.",
			"formTypeMiniprogramUrlErrorEmpty": "¡La página web de respaldo no puede estar vacía!",
			"formNameTips4": "Solo se admiten caracteres chinos, ingleses y números, no más de 4 caracteres.",
			"formNameTips6": "Solo se admiten caracteres chinos, ingleses y números, no más de 6 caracteres.",
			"formOrderTips": "Solo se admiten números, no más de 6 caracteres. El orden se clasifica por orden alfabético.",
			"msgFirstMaxLen": "¡Solo se pueden crear hasta 3 menús de primer nivel!",
			"menuMsgSubMaxLen": "¡Solo se pueden crear hasta 5 menús de segundo nivel!",
			"menuMsgParentNotSave": "¡Los datos del menú superior no se han guardado, guarde los datos primero!",
			"menuDeleteAlertMsg": "¿Está seguro de que desea eliminar estos datos? Se eliminarán todos los submenús asociados.",
			"menuDeleteSuccess": "¡Datos eliminados con éxito!",
			"menuSaveSuccess": "¡Datos guardados con éxito!",
			"formNameErrorEmpty": "¡El nombre del menú no puede estar vacío!",
			"formNameErrorMaxLen4": "¡El nombre del menú no puede tener más de 4 caracteres!",
			"formNameErrorMaxLen6": "¡El nombre del menú no puede tener más de 6 caracteres!",
			"formNameError": "Excede el límite de caracteres",
			"formOrderErrorEmpty": "¡El número de orden del menú no puede estar vacío!",
			"formOrderErrorNotNumber": "¡El número de orden del menú solo puede contener números!",
			"formOrderErrorMaxLen": "¡El número de orden del menú no puede tener más de 6 caracteres!",
        }
    },
    "_pushConfig": {
        "pushType": "Servicio de envío de mensajes",
		"pushTypeInfo": "O2OA admite servicios de envío de mensajes de JPush y Huawei, puede elegir el servicio según sus necesidades.",
		"pushTypeData": [
			{"value": "jpush", "label": "jpush", "text": "Servicio de envío de mensajes de JPush"},
			{"value": "none", "label": "none", "text": "Deshabilitar el servicio de envío de mensajes"}
		],

		"appKey": "Clave de aplicación de JPush",
		"masterSecret": "Secreto maestro de JPush",
		"appKeyInfo": "La clave de la aplicación de JPush",
		"masterSecretInfo": "El secreto maestro de la aplicación de JPush",

		"appId": "ID de aplicación de Huawei",
		"appSecret": "App Secret de Huawei",
		"appIdInfo": "El ID de la aplicación de Huawei",
		"appSecretInfo": "El App Secret de la aplicación de Huawei."
    },
    "_messageConfig": {
        "messageConsumers": "Configuración del canal",
		"messageType": "Configuración del tipo",
		"messageLoader": "Cargador",
		"messageFilter": "Filtro",

        "consumerTypes": {
            "ws": "WebSocket",
            "pmsinner": "Mensaje de envío",
			"calendar": "Calendario",
			"dingding": "DingDing",
			"welink": "WeLink",
			"qiyeweixin": "WeChat Empresarial",
			"mpweixin": "Cuenta pública de WeChat",
			"kafka": "Kafka",
			"activemq": "ActiveMQ",
			"restful": "Restful",
			"mail": "Correo electrónico",
			"jdbc": "JDBC",
			"table": "Tabla de datos",
			"hadoop": "Hadoop",
			"andfx": "Mensaje de oficina móvil"
        },
        "consumerInfoTitle": "Configuración del canal de mensajes",
		"consumerInfo": "El sistema O2OA proporciona varios canales de mensajes. Puede establecer aquí cómo se deben enviar los diferentes tipos de mensajes.",
		"consumerInfo2": "Para obtener más información sobre la configuración de mensajes, consulte: <a href='https://www.o2oa.net/search.html?q=%E6%B6%88%E6%81%AF%E9%85%8D%E7%BD%AE' target='_blank'>Mensajes</a>",

		"addConsumer": "Agregar canal de mensajes",
		"consumerLabel": {
			"key": "Nombre del canal",
			"type": "Tipo",
			"filter": "Filtro",
			"loader": "Cargador",
			"startTlsEnable": "Habilitar cifrado de transporte SSL"
		},
		"none": "Ninguno",
		"editConsumer": "Editar canal de mensajes",

		"inputKey": "Ingrese el nombre del canal de mensajes",
		"hasKey": "El nombre del canal de mensajes ya existe, utilice otro nombre.",

        "consumerData": {
            "kafka": ['bootstrapServers', 'topic', 'securityProtocol', 'saslMechanism', 'saslMechanism', 'username', 'password'],
            "activemq": ['url', 'queueName', 'username', 'password'],
            "restful": ['url', 'method', 'internal'],
            "mail": ['host', 'port', 'sslEnable', 'auth', 'startTlsEnable', 'from', 'password'],
            "jdbc": ['driverClass', 'url', 'catalog', 'schema', 'table', 'username', 'password'],
            "table": ['table'],
            "hadoop": ['fsDefaultFS', 'path', 'username']
        },

        "messageTypeTitle": "Configuración del tipo de mensaje",
		"messageTypeInfo": "Se pueden enviar mensajes para varios eventos integrados en el sistema O2OA. En este lugar, puede establecer qué canales se deben utilizar para enviar mensajes para estos eventos. También puede agregar tipos de mensajes personalizados.",

		"noConsumer": "No se ha seleccionado ningún canal de envío para este tipo de mensajes.",
		"selectConsumer": "Seleccionar canal",
		"addTmpConsumer": "Agregar canal",

		"addMessageType": "Agregar tipo de mensaje",
		"newMessageData": {
			"key": "Identificación",
			"description": "Descripción"
		},
		"inputMessageKey": "Ingrese la identificación del mensaje",
		"hasMessageKey": "La identificación del mensaje ya existe, utilice otra identificación.",

		"deleteTypeTitle": "Confirmar",
		"deleteTypeInfo": "¿Está seguro de que desea eliminar el tipo de mensaje \"{name}\"?",

       "filterConfigTitle": "Configuración del filtro de mensajes",
		"filterConfigInfo": "En los canales de mensajes, se pueden utilizar filtros que son scripts del servidor que se llaman antes de enviar un mensaje y que devuelven true si el mensaje se puede enviar y false si no se debe enviar.",
		"addFilter": "Agregar filtro de mensajes",
		"filterKey": "Nombre",

		"inputFilterKey": "Ingrese el nombre del filtro",
		"hasFilterKey": "El nombre del filtro ya existe, utilice otro nombre.",

		"deleteFilterTitle": "Confirmar",
		"deleteFilterInfo": "¿Está seguro de que desea eliminar el filtro \"{name}\"?",

		"loaderConfigTitle": "Configuración del cargador de mensajes",
		"loaderConfigInfo": "En los canales de mensajes, se pueden utilizar cargadores que son scripts del servidor que se llaman antes de enviar un mensaje y que modifican el contenido del mensaje. Debe devolver datos en formato JSON que se usarán como contenido del mensaje a enviar.",
		"addLoader": "Agregar cargador de mensajes",
		"loaderKey": "Nombre",

		"inputLoaderKey": "Ingrese el nombre del cargador",
		"hasLoaderKey": "El nombre del cargador ya existe, utilice otro nombre.",

		"deleteLoaderTitle": "Confirmar",
		"deleteLoaderInfo": "¿Está seguro de que desea eliminar el cargador \"{name}\"?",

		"deleteConsumerTitle": "Confirmar",
		"deleteConsumerInfo": "¿Está seguro de que desea eliminar el canal de mensajes \"{name}\"?",

        "loaderComment": "/*\nEl objeto 'message' es el cuerpo del mensaje y se inyecta automáticamente en el contexto de ejecución del script. Tiene cuatro campos:\nmessage.title: Título\nmessage.person: Destinatario\nmessage.type: Tipo de mensaje, por ejemplo: task_create\nmessage.body: Cuerpo del mensaje, por ejemplo: datos de la tarea (pendiente) almacenados en formato JSON para un mensaje de tipo task_create.\nDebe devolver el objeto 'message' como resultado.\n*/\nreturn message;",
		"filterComment": "/*\nEl objeto 'message' es el cuerpo del mensaje y se inyecta automáticamente en el contexto de ejecución del script. Tiene cuatro campos:\nmessage.title: Título\nmessage.person: Destinatario\nmessage.type: Tipo de mensaje, por ejemplo: task_create\nmessage.body: Cuerpo del mensaje, por ejemplo: datos de la tarea (pendiente) almacenados en formato JSON para un mensaje de tipo task_create.\nDebe devolver verdadero si se debe enviar el mensaje y falso si no se debe enviar.\n*/\nreturn true;"
    }
}
