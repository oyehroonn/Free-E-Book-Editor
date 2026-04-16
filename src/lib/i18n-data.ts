import type { Category } from "@/lib/utils"

export const SUPPORTED_LOCALES = ["en", "es", "fr", "de", "pt"] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

const en = {
  meta: {
    htmlLang: "en",
    intlLocale: "en-US",
    languageName: "English",
  },
  roles: {
    admin: "admin",
    user: "user",
  },
  navbar: {
    explore: "Explore",
    dashboard: "Dashboard",
    newFlipbook: "New Flipbook",
    createFlipbook: "Create Flipbook",
    login: "Login",
    createAccount: "Create Account",
    logout: "Logout",
    signedOut: "Signed out",
    toggleMenu: "Toggle menu",
  },
  footer: {
    description:
      "Create beautiful digital flipbooks with rich text, images, and embedded videos. Share your stories with the world.",
    platform: "Platform",
    exploreBooks: "Explore Books",
    createBook: "Create a Book",
    support: "Support",
    rightsReserved: "All rights reserved.",
    mvpMessage: "This is an MVP app. Please bear with us.",
  },
  landing: {
    heroBadge: "Premium Digital Publishing Platform",
    heroTitle: "Your stories, beautifully bound.",
    heroDescription:
      "Create stunning digital flipbooks that read like real books. Add rich text, images, and YouTube videos. Share with the world.",
    createButton: "Create Your Book",
    browseButton: "Browse Library",
    featuresTitle: "Everything you need to publish",
    featuresDescription:
      "A powerful yet simple editor designed for storytellers, educators, and creators.",
    features: [
      {
        title: "Rich Text Editing",
        description:
          "Full typography controls for bold, italic, lists, links, and more. Powered by TipTap.",
      },
      {
        title: "Image Blocks",
        description:
          "Upload photos, add captions, and have them beautifully laid out on your pages.",
      },
      {
        title: "YouTube Embeds",
        description:
          "Paste any YouTube link and it becomes a playable video embed right in your book.",
      },
      {
        title: "Realistic Flipbook",
        description:
          "Smooth page-flip animations that make your digital book feel like the real thing.",
      },
      {
        title: "Instant Publishing",
        description:
          "Write, preview, and publish in minutes. Share a link anyone can open in a browser.",
      },
      {
        title: "Beautiful Themes",
        description:
          "Editorial styling that makes every book look professionally produced.",
      },
    ],
    recentTitle: "Recently Published",
    recentDescription: "Explore books created by writers around the world.",
    viewAll: "View All",
    ctaTitle: "Ready to write your first book?",
    ctaDescription:
      "Create a basic account, start a draft flipbook, and publish it only when you are ready to share it with the world.",
    ctaButton: "Create an Account",
  },
  explore: {
    title: "Explore the Library",
    description: "Discover books published by writers around the world.",
    unavailableTitle: "Library temporarily unavailable",
    unavailableDescription:
      "The public catalog could not be loaded right now. Check the backend URL env in Cloudflare and try again.",
    emptyTitle: "No books found",
    emptySearch: 'No results for "{search}". Try a different search term.',
    emptyCategory: "Be the first to publish in this category.",
    filters: {
      searchPlaceholder: "Search by title, author, or description…",
      searchButton: "Search",
      all: "All",
      sortBy: "Sort by:",
      newest: "Newest",
      popular: "Most Viewed",
      updating: "Updating results…",
    },
  },
  dashboard: {
    creatorBadge: "Creator Dashboard",
    title: "Your flipbooks",
    description:
      "Drafts stay private to you until you publish them. Once a flipbook is public, it goes live in Explore and the featured section and can be shared by link.",
    createButton: "Create New Flipbook",
    emptyTitle: "No flipbooks yet",
    emptyDescription:
      "Start your first draft, edit it in the ebook editor, and publish it only when you are ready for it to show up to everyone else.",
    emptyButton: "Create Your First Flipbook",
    card: {
      noCover: "No cover yet",
      public: "Public",
      draft: "Draft",
      noDescription: "No description yet. Open the editor to flesh out your flipbook.",
      author: "Author",
      updated: "Updated",
      slug: "Slug",
      visiblePublic: "Visible in Explore and Featured",
      visiblePrivate: "Private until you publish it",
      editButton: "Edit in Ebook Editor",
      openPublicPage: "Open Public Page",
      publishHint: "Publish this flipbook from the editor to make it public and shareable.",
    },
  },
  create: {
    title: "Create a new book",
    description:
      "You are signed in as {username}. Fill in the basics now and edit the rest later in the ebook editor.",
    form: {
      coverImage: "Cover Image",
      optional: "(optional)",
      coverAlt: "Cover",
      uploadCover: "Upload cover image",
      uploading: "Uploading…",
      coverHint: "JPG, PNG, or WebP. Max 5MB. Ideal ratio: 3:4.",
      titleLabel: "Book Title",
      titlePlaceholder: "The Great Journey",
      subtitleLabel: "Subtitle",
      subtitlePlaceholder: "A story about adventure and discovery (optional)",
      authorLabel: "Author Name",
      authorPlaceholder: "Your name or pen name",
      descriptionLabel: "Description",
      descriptionPlaceholder: "What is this book about? (optional)",
      categoryLabel: "Category",
      categoryPlaceholder: "Choose a category (optional)",
      submit: "Create Book & Open Editor",
      titleRequired: "Title is required",
      authorRequired: "Author name is required",
      coverTooLarge: "Cover image must be under 5MB",
      coverUploadFailed: "Failed to upload cover image",
      createdSuccess: "Book created! Opening editor…",
    },
  },
  authShell: {
    mvp: "MVP App",
    patience: "Please bear with us",
    resetHelp: "Need a password reset? Email {email}.",
  },
  login: {
    title: "Welcome back",
    description:
      "Sign in to manage your flipbooks, publish them when ready, and keep drafts private until they go live.",
    alternateText: "Need an account?",
    alternateLabel: "Create one",
    form: {
      identifierLabel: "Username or Email",
      identifierPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      submit: "Sign In",
      success: "Welcome back, {username}",
    },
  },
  register: {
    title: "Create your account",
    description:
      "Use a basic MVP account to save your flipbooks, return to the editor later, and control when each book becomes public.",
    alternateText: "Already have an account?",
    alternateLabel: "Sign in",
    form: {
      usernameLabel: "Username",
      usernamePlaceholder: "storybookmaker",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a password",
      submit: "Create Account",
      success: "Account created for {username}",
    },
  },
  bookCard: {
    openBook: "Open Book",
    by: "by",
  },
} as const

type WidenLiterals<T> =
  T extends string ? string :
  T extends readonly (infer U)[] ? readonly WidenLiterals<U>[] :
  T extends object ? { [K in keyof T]: WidenLiterals<T[K]> } :
  T

export type Dictionary = WidenLiterals<typeof en>

export const DICTIONARIES: Record<AppLocale, Dictionary> = {
  en,
  es: {
    meta: {
      htmlLang: "es",
      intlLocale: "es-ES",
      languageName: "Español",
    },
    roles: {
      admin: "administrador",
      user: "usuario",
    },
    navbar: {
      explore: "Explorar",
      dashboard: "Panel",
      newFlipbook: "Nuevo flipbook",
      createFlipbook: "Crear flipbook",
      login: "Iniciar sesión",
      createAccount: "Crear cuenta",
      logout: "Cerrar sesión",
      signedOut: "Sesión cerrada",
      toggleMenu: "Abrir menú",
    },
    footer: {
      description:
        "Crea flipbooks digitales con texto enriquecido, imágenes y videos incrustados. Comparte tus historias con el mundo.",
      platform: "Plataforma",
      exploreBooks: "Explorar libros",
      createBook: "Crear un libro",
      support: "Soporte",
      rightsReserved: "Todos los derechos reservados.",
      mvpMessage: "Esta es una app MVP. Gracias por tu paciencia.",
    },
    landing: {
      heroBadge: "Plataforma premium de publicación digital",
      heroTitle: "Tus historias, bellamente encuadernadas.",
      heroDescription:
        "Crea flipbooks digitales que se sienten como libros reales. Añade texto, imágenes y videos de YouTube. Compártelos con el mundo.",
      createButton: "Crear tu libro",
      browseButton: "Explorar biblioteca",
      featuresTitle: "Todo lo que necesitas para publicar",
      featuresDescription:
        "Un editor potente y sencillo para narradores, educadores y creadores.",
      features: [
        {
          title: "Edición de texto enriquecido",
          description:
            "Controles tipográficos completos para negritas, cursivas, listas, enlaces y más. Potenciado por TipTap.",
        },
        {
          title: "Bloques de imagen",
          description:
            "Sube fotos, añade subtítulos y ordénalas con elegancia en tus páginas.",
        },
        {
          title: "YouTube integrado",
          description:
            "Pega cualquier enlace de YouTube y se convertirá en un video reproducible dentro de tu libro.",
        },
        {
          title: "Flipbook realista",
          description:
            "Animaciones fluidas de cambio de página para que tu libro digital se sienta real.",
        },
        {
          title: "Publicación instantánea",
          description:
            "Escribe, previsualiza y publica en minutos. Comparte un enlace que cualquiera puede abrir.",
        },
        {
          title: "Temas elegantes",
          description:
            "Un estilo editorial cuidado que hace que cada libro se vea profesional.",
        },
      ],
      recentTitle: "Publicados recientemente",
      recentDescription: "Explora libros creados por autores de todo el mundo.",
      viewAll: "Ver todo",
      ctaTitle: "¿Listo para escribir tu primer libro?",
      ctaDescription:
        "Crea una cuenta básica, empieza un borrador y publícalo solo cuando quieras compartirlo con el mundo.",
      ctaButton: "Crear una cuenta",
    },
    explore: {
      title: "Explora la biblioteca",
      description: "Descubre libros publicados por autores de todo el mundo.",
      unavailableTitle: "La biblioteca no está disponible temporalmente",
      unavailableDescription:
        "No se pudo cargar el catálogo público ahora mismo. Revisa la variable de entorno del backend en Cloudflare e inténtalo de nuevo.",
      emptyTitle: "No se encontraron libros",
      emptySearch: 'No hay resultados para "{search}". Prueba con otro término.',
      emptyCategory: "Sé la primera persona en publicar en esta categoría.",
      filters: {
        searchPlaceholder: "Busca por título, autor o descripción…",
        searchButton: "Buscar",
        all: "Todo",
        sortBy: "Ordenar por:",
        newest: "Más recientes",
        popular: "Más vistos",
        updating: "Actualizando resultados…",
      },
    },
    dashboard: {
      creatorBadge: "Panel del creador",
      title: "Tus flipbooks",
      description:
        "Los borradores permanecen privados hasta que los publiques. Cuando un flipbook es público, aparece en Explorar y en destacados, y se puede compartir por enlace.",
      createButton: "Crear flipbook",
      emptyTitle: "Aún no tienes flipbooks",
      emptyDescription:
        "Empieza tu primer borrador, edítalo en el editor y publícalo solo cuando quieras mostrarlo a todo el mundo.",
      emptyButton: "Crear tu primer flipbook",
      card: {
        noCover: "Sin portada todavía",
        public: "Público",
        draft: "Borrador",
        noDescription:
          "Todavía no hay descripción. Abre el editor para completar tu flipbook.",
        author: "Autor",
        updated: "Actualizado",
        slug: "Ruta",
        visiblePublic: "Visible en Explorar y destacados",
        visiblePrivate: "Privado hasta que lo publiques",
        editButton: "Editar en el editor",
        openPublicPage: "Abrir página pública",
        publishHint:
          "Publica este flipbook desde el editor para hacerlo público y compartible.",
      },
    },
    create: {
      title: "Crear un libro nuevo",
      description:
        "Has iniciado sesión como {username}. Completa lo básico ahora y edita el resto más tarde en el editor.",
      form: {
        coverImage: "Portada",
        optional: "(opcional)",
        coverAlt: "Portada",
        uploadCover: "Subir portada",
        uploading: "Subiendo…",
        coverHint: "JPG, PNG o WebP. Máximo 5 MB. Proporción ideal: 3:4.",
        titleLabel: "Título del libro",
        titlePlaceholder: "El gran viaje",
        subtitleLabel: "Subtítulo",
        subtitlePlaceholder: "Una historia de aventura y descubrimiento (opcional)",
        authorLabel: "Nombre del autor",
        authorPlaceholder: "Tu nombre o seudónimo",
        descriptionLabel: "Descripción",
        descriptionPlaceholder: "¿De qué trata este libro? (opcional)",
        categoryLabel: "Categoría",
        categoryPlaceholder: "Elige una categoría (opcional)",
        submit: "Crear libro y abrir editor",
        titleRequired: "El título es obligatorio",
        authorRequired: "El nombre del autor es obligatorio",
        coverTooLarge: "La portada debe pesar menos de 5 MB",
        coverUploadFailed: "No se pudo subir la portada",
        createdSuccess: "Libro creado. Abriendo el editor…",
      },
    },
    authShell: {
      mvp: "App MVP",
      patience: "Gracias por tu paciencia",
      resetHelp: "¿Necesitas restablecer tu contraseña? Escribe a {email}.",
    },
    login: {
      title: "Bienvenido de nuevo",
      description:
        "Inicia sesión para gestionar tus flipbooks, publicarlos cuando quieras y mantener los borradores privados hasta entonces.",
      alternateText: "¿Necesitas una cuenta?",
      alternateLabel: "Créala",
      form: {
        identifierLabel: "Usuario o correo",
        identifierPlaceholder: "tu@correo.com",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Introduce tu contraseña",
        submit: "Iniciar sesión",
        success: "Bienvenido de nuevo, {username}",
      },
    },
    register: {
      title: "Crea tu cuenta",
      description:
        "Usa una cuenta MVP básica para guardar tus flipbooks, volver al editor más tarde y decidir cuándo cada libro pasa a ser público.",
      alternateText: "¿Ya tienes una cuenta?",
      alternateLabel: "Inicia sesión",
      form: {
        usernameLabel: "Nombre de usuario",
        usernamePlaceholder: "creadordehistorias",
        emailLabel: "Correo",
        emailPlaceholder: "tu@correo.com",
        passwordLabel: "Contraseña",
        passwordPlaceholder: "Crea una contraseña",
        submit: "Crear cuenta",
        success: "Cuenta creada para {username}",
      },
    },
    bookCard: {
      openBook: "Abrir libro",
      by: "por",
    },
  },
  fr: {
    meta: {
      htmlLang: "fr",
      intlLocale: "fr-FR",
      languageName: "Français",
    },
    roles: {
      admin: "admin",
      user: "utilisateur",
    },
    navbar: {
      explore: "Explorer",
      dashboard: "Tableau de bord",
      newFlipbook: "Nouveau flipbook",
      createFlipbook: "Créer un flipbook",
      login: "Connexion",
      createAccount: "Créer un compte",
      logout: "Déconnexion",
      signedOut: "Déconnecté",
      toggleMenu: "Ouvrir le menu",
    },
    footer: {
      description:
        "Créez de beaux flipbooks numériques avec du texte enrichi, des images et des vidéos intégrées. Partagez vos histoires avec le monde.",
      platform: "Plateforme",
      exploreBooks: "Explorer les livres",
      createBook: "Créer un livre",
      support: "Support",
      rightsReserved: "Tous droits réservés.",
      mvpMessage: "Cette application est un MVP. Merci de votre patience.",
    },
    landing: {
      heroBadge: "Plateforme premium de publication numérique",
      heroTitle: "Vos histoires, magnifiquement reliées.",
      heroDescription:
        "Créez de superbes flipbooks numériques qui se lisent comme de vrais livres. Ajoutez du texte, des images et des vidéos YouTube. Partagez-les avec le monde.",
      createButton: "Créer votre livre",
      browseButton: "Parcourir la bibliothèque",
      featuresTitle: "Tout ce qu’il faut pour publier",
      featuresDescription:
        "Un éditeur puissant et simple pour les auteurs, enseignants et créateurs.",
      features: [
        {
          title: "Édition de texte enrichi",
          description:
            "Des contrôles typographiques complets pour le gras, l’italique, les listes, les liens et plus encore. Propulsé par TipTap.",
        },
        {
          title: "Blocs image",
          description:
            "Importez des photos, ajoutez des légendes et disposez-les élégamment sur vos pages.",
        },
        {
          title: "Intégration YouTube",
          description:
            "Collez n’importe quel lien YouTube et il devient une vidéo lisible dans votre livre.",
        },
        {
          title: "Flipbook réaliste",
          description:
            "Des animations fluides de changement de page pour un rendu proche d’un vrai livre.",
        },
        {
          title: "Publication instantanée",
          description:
            "Écrivez, prévisualisez et publiez en quelques minutes. Partagez un lien accessible depuis n’importe quel navigateur.",
        },
        {
          title: "Thèmes élégants",
          description:
            "Une présentation éditoriale soignée qui donne à chaque livre une allure professionnelle.",
        },
      ],
      recentTitle: "Récemment publiés",
      recentDescription: "Découvrez des livres créés par des auteurs du monde entier.",
      viewAll: "Voir tout",
      ctaTitle: "Prêt à écrire votre premier livre ?",
      ctaDescription:
        "Créez un compte de base, démarrez un brouillon et publiez-le uniquement lorsque vous êtes prêt à le partager.",
      ctaButton: "Créer un compte",
    },
    explore: {
      title: "Explorer la bibliothèque",
      description: "Découvrez les livres publiés par des auteurs du monde entier.",
      unavailableTitle: "Bibliothèque temporairement indisponible",
      unavailableDescription:
        "Le catalogue public n’a pas pu être chargé pour le moment. Vérifiez la variable d’environnement du backend dans Cloudflare puis réessayez.",
      emptyTitle: "Aucun livre trouvé",
      emptySearch: 'Aucun résultat pour "{search}". Essayez un autre terme.',
      emptyCategory: "Soyez la première personne à publier dans cette catégorie.",
      filters: {
        searchPlaceholder: "Rechercher par titre, auteur ou description…",
        searchButton: "Rechercher",
        all: "Tous",
        sortBy: "Trier par :",
        newest: "Plus récents",
        popular: "Plus vus",
        updating: "Mise à jour des résultats…",
      },
    },
    dashboard: {
      creatorBadge: "Espace créateur",
      title: "Vos flipbooks",
      description:
        "Les brouillons restent privés tant que vous ne les publiez pas. Une fois public, un flipbook apparaît dans Explorer et dans les sélections, puis peut être partagé par lien.",
      createButton: "Créer un flipbook",
      emptyTitle: "Aucun flipbook pour le moment",
      emptyDescription:
        "Commencez votre premier brouillon, modifiez-le dans l’éditeur puis publiez-le seulement quand vous êtes prêt.",
      emptyButton: "Créer votre premier flipbook",
      card: {
        noCover: "Pas encore de couverture",
        public: "Public",
        draft: "Brouillon",
        noDescription:
          "Aucune description pour l’instant. Ouvrez l’éditeur pour compléter votre flipbook.",
        author: "Auteur",
        updated: "Mis à jour",
        slug: "Lien",
        visiblePublic: "Visible dans Explorer et à la une",
        visiblePrivate: "Privé jusqu’à publication",
        editButton: "Modifier dans l’éditeur",
        openPublicPage: "Ouvrir la page publique",
        publishHint:
          "Publiez ce flipbook depuis l’éditeur pour le rendre public et partageable.",
      },
    },
    create: {
      title: "Créer un nouveau livre",
      description:
        "Vous êtes connecté en tant que {username}. Renseignez l’essentiel maintenant et modifiez le reste plus tard dans l’éditeur.",
      form: {
        coverImage: "Couverture",
        optional: "(optionnel)",
        coverAlt: "Couverture",
        uploadCover: "Importer une couverture",
        uploading: "Import en cours…",
        coverHint: "JPG, PNG ou WebP. 5 Mo max. Ratio idéal : 3:4.",
        titleLabel: "Titre du livre",
        titlePlaceholder: "Le grand voyage",
        subtitleLabel: "Sous-titre",
        subtitlePlaceholder: "Une histoire d’aventure et de découverte (optionnel)",
        authorLabel: "Nom de l’auteur",
        authorPlaceholder: "Votre nom ou pseudonyme",
        descriptionLabel: "Description",
        descriptionPlaceholder: "De quoi parle ce livre ? (optionnel)",
        categoryLabel: "Catégorie",
        categoryPlaceholder: "Choisir une catégorie (optionnel)",
        submit: "Créer le livre et ouvrir l’éditeur",
        titleRequired: "Le titre est obligatoire",
        authorRequired: "Le nom de l’auteur est obligatoire",
        coverTooLarge: "La couverture doit faire moins de 5 Mo",
        coverUploadFailed: "Impossible d’importer la couverture",
        createdSuccess: "Livre créé. Ouverture de l’éditeur…",
      },
    },
    authShell: {
      mvp: "App MVP",
      patience: "Merci de votre patience",
      resetHelp: "Besoin de réinitialiser votre mot de passe ? Écrivez à {email}.",
    },
    login: {
      title: "Bon retour",
      description:
        "Connectez-vous pour gérer vos flipbooks, les publier quand vous le souhaitez et garder les brouillons privés jusque-là.",
      alternateText: "Besoin d’un compte ?",
      alternateLabel: "Créez-en un",
      form: {
        identifierLabel: "Nom d’utilisateur ou e-mail",
        identifierPlaceholder: "vous@exemple.com",
        passwordLabel: "Mot de passe",
        passwordPlaceholder: "Saisissez votre mot de passe",
        submit: "Se connecter",
        success: "Bon retour, {username}",
      },
    },
    register: {
      title: "Créer votre compte",
      description:
        "Utilisez un compte MVP simple pour enregistrer vos flipbooks, revenir à l’éditeur plus tard et décider quand chaque livre devient public.",
      alternateText: "Vous avez déjà un compte ?",
      alternateLabel: "Se connecter",
      form: {
        usernameLabel: "Nom d’utilisateur",
        usernamePlaceholder: "createurdhistoires",
        emailLabel: "E-mail",
        emailPlaceholder: "vous@exemple.com",
        passwordLabel: "Mot de passe",
        passwordPlaceholder: "Créer un mot de passe",
        submit: "Créer un compte",
        success: "Compte créé pour {username}",
      },
    },
    bookCard: {
      openBook: "Ouvrir le livre",
      by: "par",
    },
  },
  de: {
    meta: {
      htmlLang: "de",
      intlLocale: "de-DE",
      languageName: "Deutsch",
    },
    roles: {
      admin: "admin",
      user: "benutzer",
    },
    navbar: {
      explore: "Entdecken",
      dashboard: "Dashboard",
      newFlipbook: "Neues Flipbook",
      createFlipbook: "Flipbook erstellen",
      login: "Anmelden",
      createAccount: "Konto erstellen",
      logout: "Abmelden",
      signedOut: "Abgemeldet",
      toggleMenu: "Menü öffnen",
    },
    footer: {
      description:
        "Erstelle digitale Flipbooks mit formatiertem Text, Bildern und eingebetteten Videos. Teile deine Geschichten mit der Welt.",
      platform: "Plattform",
      exploreBooks: "Bücher entdecken",
      createBook: "Buch erstellen",
      support: "Support",
      rightsReserved: "Alle Rechte vorbehalten.",
      mvpMessage: "Dies ist eine MVP-App. Danke für deine Geduld.",
    },
    landing: {
      heroBadge: "Premium-Plattform für digitales Publizieren",
      heroTitle: "Deine Geschichten, schön gebunden.",
      heroDescription:
        "Erstelle digitale Flipbooks, die sich wie echte Bücher lesen. Füge Text, Bilder und YouTube-Videos hinzu und teile sie mit der Welt.",
      createButton: "Dein Buch erstellen",
      browseButton: "Bibliothek durchsuchen",
      featuresTitle: "Alles, was du zum Veröffentlichen brauchst",
      featuresDescription:
        "Ein leistungsstarker und zugleich einfacher Editor für Autorinnen, Lehrende und Kreative.",
      features: [
        {
          title: "Rich-Text-Bearbeitung",
          description:
            "Volle Typografie-Steuerung für Fett, Kursiv, Listen, Links und mehr. Mit TipTap.",
        },
        {
          title: "Bildblöcke",
          description:
            "Lade Fotos hoch, ergänze Bildunterschriften und ordne sie sauber auf deinen Seiten an.",
        },
        {
          title: "YouTube-Einbettungen",
          description:
            "Füge einen YouTube-Link ein und er wird direkt im Buch als Video abgespielt.",
        },
        {
          title: "Realistisches Flipbook",
          description:
            "Flüssige Seitenwechsel sorgen dafür, dass sich dein digitales Buch echt anfühlt.",
        },
        {
          title: "Sofort veröffentlichen",
          description:
            "Schreiben, Vorschau ansehen und in wenigen Minuten veröffentlichen. Teile einen Link, den jeder im Browser öffnen kann.",
        },
        {
          title: "Schöne Themes",
          description:
            "Ein editoriales Erscheinungsbild, das jedes Buch professionell wirken lässt.",
        },
      ],
      recentTitle: "Kürzlich veröffentlicht",
      recentDescription: "Entdecke Bücher von Autorinnen und Autoren aus aller Welt.",
      viewAll: "Alle anzeigen",
      ctaTitle: "Bereit für dein erstes Buch?",
      ctaDescription:
        "Erstelle ein einfaches Konto, beginne einen Entwurf und veröffentliche ihn erst, wenn du ihn teilen möchtest.",
      ctaButton: "Konto erstellen",
    },
    explore: {
      title: "Bibliothek entdecken",
      description: "Entdecke veröffentlichte Bücher aus aller Welt.",
      unavailableTitle: "Bibliothek vorübergehend nicht verfügbar",
      unavailableDescription:
        "Der öffentliche Katalog konnte gerade nicht geladen werden. Prüfe die Backend-URL in Cloudflare und versuche es erneut.",
      emptyTitle: "Keine Bücher gefunden",
      emptySearch: 'Keine Ergebnisse für "{search}". Versuche einen anderen Suchbegriff.',
      emptyCategory: "Sei die erste Person, die in dieser Kategorie veröffentlicht.",
      filters: {
        searchPlaceholder: "Nach Titel, Autor oder Beschreibung suchen…",
        searchButton: "Suchen",
        all: "Alle",
        sortBy: "Sortieren nach:",
        newest: "Neueste",
        popular: "Meistgesehen",
        updating: "Ergebnisse werden aktualisiert…",
      },
    },
    dashboard: {
      creatorBadge: "Creator-Dashboard",
      title: "Deine Flipbooks",
      description:
        "Entwürfe bleiben privat, bis du sie veröffentlichst. Sobald ein Flipbook öffentlich ist, erscheint es unter Entdecken und in den Highlights und kann per Link geteilt werden.",
      createButton: "Neues Flipbook erstellen",
      emptyTitle: "Noch keine Flipbooks",
      emptyDescription:
        "Starte deinen ersten Entwurf, bearbeite ihn im Editor und veröffentliche ihn erst, wenn er für alle sichtbar sein soll.",
      emptyButton: "Erstes Flipbook erstellen",
      card: {
        noCover: "Noch kein Cover",
        public: "Öffentlich",
        draft: "Entwurf",
        noDescription:
          "Noch keine Beschreibung. Öffne den Editor, um dein Flipbook weiter auszuarbeiten.",
        author: "Autor",
        updated: "Aktualisiert",
        slug: "Pfad",
        visiblePublic: "Sichtbar unter Entdecken und Highlights",
        visiblePrivate: "Privat bis zur Veröffentlichung",
        editButton: "Im Editor bearbeiten",
        openPublicPage: "Öffentliche Seite öffnen",
        publishHint:
          "Veröffentliche dieses Flipbook im Editor, damit es öffentlich und teilbar wird.",
      },
    },
    create: {
      title: "Neues Buch erstellen",
      description:
        "Du bist als {username} angemeldet. Trage jetzt die Grundlagen ein und bearbeite den Rest später im Editor.",
      form: {
        coverImage: "Coverbild",
        optional: "(optional)",
        coverAlt: "Cover",
        uploadCover: "Cover hochladen",
        uploading: "Wird hochgeladen…",
        coverHint: "JPG, PNG oder WebP. Maximal 5 MB. Ideales Seitenverhältnis: 3:4.",
        titleLabel: "Buchtitel",
        titlePlaceholder: "Die große Reise",
        subtitleLabel: "Untertitel",
        subtitlePlaceholder: "Eine Geschichte über Abenteuer und Entdeckung (optional)",
        authorLabel: "Autorname",
        authorPlaceholder: "Dein Name oder Künstlername",
        descriptionLabel: "Beschreibung",
        descriptionPlaceholder: "Worum geht es in diesem Buch? (optional)",
        categoryLabel: "Kategorie",
        categoryPlaceholder: "Kategorie auswählen (optional)",
        submit: "Buch erstellen und Editor öffnen",
        titleRequired: "Ein Titel ist erforderlich",
        authorRequired: "Ein Autorname ist erforderlich",
        coverTooLarge: "Das Coverbild muss kleiner als 5 MB sein",
        coverUploadFailed: "Das Coverbild konnte nicht hochgeladen werden",
        createdSuccess: "Buch erstellt. Editor wird geöffnet…",
      },
    },
    authShell: {
      mvp: "MVP-App",
      patience: "Danke für deine Geduld",
      resetHelp: "Passwort zurücksetzen? Schreib an {email}.",
    },
    login: {
      title: "Willkommen zurück",
      description:
        "Melde dich an, um deine Flipbooks zu verwalten, sie bei Bedarf zu veröffentlichen und Entwürfe bis dahin privat zu halten.",
      alternateText: "Du brauchst ein Konto?",
      alternateLabel: "Jetzt erstellen",
      form: {
        identifierLabel: "Benutzername oder E-Mail",
        identifierPlaceholder: "du@example.com",
        passwordLabel: "Passwort",
        passwordPlaceholder: "Passwort eingeben",
        submit: "Anmelden",
        success: "Willkommen zurück, {username}",
      },
    },
    register: {
      title: "Konto erstellen",
      description:
        "Mit einem einfachen MVP-Konto kannst du deine Flipbooks speichern, später zum Editor zurückkehren und steuern, wann ein Buch öffentlich wird.",
      alternateText: "Du hast bereits ein Konto?",
      alternateLabel: "Anmelden",
      form: {
        usernameLabel: "Benutzername",
        usernamePlaceholder: "geschichtenersteller",
        emailLabel: "E-Mail",
        emailPlaceholder: "du@example.com",
        passwordLabel: "Passwort",
        passwordPlaceholder: "Passwort erstellen",
        submit: "Konto erstellen",
        success: "Konto für {username} erstellt",
      },
    },
    bookCard: {
      openBook: "Buch öffnen",
      by: "von",
    },
  },
  pt: {
    meta: {
      htmlLang: "pt-BR",
      intlLocale: "pt-BR",
      languageName: "Português",
    },
    roles: {
      admin: "admin",
      user: "usuário",
    },
    navbar: {
      explore: "Explorar",
      dashboard: "Painel",
      newFlipbook: "Novo flipbook",
      createFlipbook: "Criar flipbook",
      login: "Entrar",
      createAccount: "Criar conta",
      logout: "Sair",
      signedOut: "Sessão encerrada",
      toggleMenu: "Abrir menu",
    },
    footer: {
      description:
        "Crie flipbooks digitais com texto rico, imagens e vídeos incorporados. Compartilhe suas histórias com o mundo.",
      platform: "Plataforma",
      exploreBooks: "Explorar livros",
      createBook: "Criar um livro",
      support: "Suporte",
      rightsReserved: "Todos os direitos reservados.",
      mvpMessage: "Este é um app MVP. Tenha um pouco de paciência.",
    },
    landing: {
      heroBadge: "Plataforma premium de publicação digital",
      heroTitle: "Suas histórias, lindamente encadernadas.",
      heroDescription:
        "Crie flipbooks digitais impressionantes que parecem livros reais. Adicione texto, imagens e vídeos do YouTube. Compartilhe com o mundo.",
      createButton: "Criar seu livro",
      browseButton: "Explorar biblioteca",
      featuresTitle: "Tudo o que você precisa para publicar",
      featuresDescription:
        "Um editor poderoso e simples para contadores de histórias, educadores e criadores.",
      features: [
        {
          title: "Edição de texto rico",
          description:
            "Controles tipográficos completos para negrito, itálico, listas, links e muito mais. Com TipTap.",
        },
        {
          title: "Blocos de imagem",
          description:
            "Envie fotos, adicione legendas e organize tudo com elegância em suas páginas.",
        },
        {
          title: "YouTube incorporado",
          description:
            "Cole qualquer link do YouTube e ele vira um vídeo reproduzível dentro do seu livro.",
        },
        {
          title: "Flipbook realista",
          description:
            "Animações suaves de virada de página deixam o seu livro digital com cara de livro de verdade.",
        },
        {
          title: "Publicação instantânea",
          description:
            "Escreva, visualize e publique em minutos. Compartilhe um link que qualquer pessoa pode abrir no navegador.",
        },
        {
          title: "Temas elegantes",
          description:
            "Um visual editorial caprichado que deixa cada livro com aparência profissional.",
        },
      ],
      recentTitle: "Publicados recentemente",
      recentDescription: "Explore livros criados por autores do mundo inteiro.",
      viewAll: "Ver tudo",
      ctaTitle: "Pronto para escrever seu primeiro livro?",
      ctaDescription:
        "Crie uma conta básica, comece um rascunho e publique só quando estiver pronto para compartilhar com o mundo.",
      ctaButton: "Criar uma conta",
    },
    explore: {
      title: "Explore a biblioteca",
      description: "Descubra livros publicados por autores do mundo inteiro.",
      unavailableTitle: "Biblioteca temporariamente indisponível",
      unavailableDescription:
        "Não foi possível carregar o catálogo público agora. Verifique a variável de ambiente do backend no Cloudflare e tente novamente.",
      emptyTitle: "Nenhum livro encontrado",
      emptySearch: 'Nenhum resultado para "{search}". Tente outro termo.',
      emptyCategory: "Seja a primeira pessoa a publicar nesta categoria.",
      filters: {
        searchPlaceholder: "Busque por título, autor ou descrição…",
        searchButton: "Buscar",
        all: "Todos",
        sortBy: "Ordenar por:",
        newest: "Mais recentes",
        popular: "Mais vistos",
        updating: "Atualizando resultados…",
      },
    },
    dashboard: {
      creatorBadge: "Painel do criador",
      title: "Seus flipbooks",
      description:
        "Os rascunhos ficam privados até você publicar. Quando um flipbook fica público, ele aparece em Explorar e nos destaques e pode ser compartilhado por link.",
      createButton: "Criar flipbook",
      emptyTitle: "Ainda não há flipbooks",
      emptyDescription:
        "Comece seu primeiro rascunho, edite no editor e publique apenas quando estiver pronto para mostrar para todo mundo.",
      emptyButton: "Criar seu primeiro flipbook",
      card: {
        noCover: "Ainda sem capa",
        public: "Público",
        draft: "Rascunho",
        noDescription:
          "Ainda não há descrição. Abra o editor para desenvolver melhor o seu flipbook.",
        author: "Autor",
        updated: "Atualizado",
        slug: "Link",
        visiblePublic: "Visível em Explorar e Destaques",
        visiblePrivate: "Privado até você publicar",
        editButton: "Editar no editor",
        openPublicPage: "Abrir página pública",
        publishHint:
          "Publique este flipbook pelo editor para deixá-lo público e compartilhável.",
      },
    },
    create: {
      title: "Criar um novo livro",
      description:
        "Você entrou como {username}. Preencha o básico agora e edite o restante depois no editor.",
      form: {
        coverImage: "Imagem de capa",
        optional: "(opcional)",
        coverAlt: "Capa",
        uploadCover: "Enviar capa",
        uploading: "Enviando…",
        coverHint: "JPG, PNG ou WebP. Máximo de 5 MB. Proporção ideal: 3:4.",
        titleLabel: "Título do livro",
        titlePlaceholder: "A grande jornada",
        subtitleLabel: "Subtítulo",
        subtitlePlaceholder: "Uma história sobre aventura e descoberta (opcional)",
        authorLabel: "Nome do autor",
        authorPlaceholder: "Seu nome ou pseudônimo",
        descriptionLabel: "Descrição",
        descriptionPlaceholder: "Sobre o que é este livro? (opcional)",
        categoryLabel: "Categoria",
        categoryPlaceholder: "Escolha uma categoria (opcional)",
        submit: "Criar livro e abrir editor",
        titleRequired: "O título é obrigatório",
        authorRequired: "O nome do autor é obrigatório",
        coverTooLarge: "A capa precisa ter menos de 5 MB",
        coverUploadFailed: "Falha ao enviar a capa",
        createdSuccess: "Livro criado. Abrindo o editor…",
      },
    },
    authShell: {
      mvp: "App MVP",
      patience: "Tenha um pouco de paciência",
      resetHelp: "Precisa redefinir sua senha? Envie um e-mail para {email}.",
    },
    login: {
      title: "Que bom ver você de novo",
      description:
        "Entre para gerenciar seus flipbooks, publicá-los quando quiser e manter rascunhos privados até lá.",
      alternateText: "Precisa de uma conta?",
      alternateLabel: "Criar agora",
      form: {
        identifierLabel: "Usuário ou e-mail",
        identifierPlaceholder: "voce@exemplo.com",
        passwordLabel: "Senha",
        passwordPlaceholder: "Digite sua senha",
        submit: "Entrar",
        success: "Que bom ver você de novo, {username}",
      },
    },
    register: {
      title: "Crie sua conta",
      description:
        "Use uma conta MVP básica para salvar seus flipbooks, voltar ao editor depois e controlar quando cada livro fica público.",
      alternateText: "Já tem uma conta?",
      alternateLabel: "Entrar",
      form: {
        usernameLabel: "Nome de usuário",
        usernamePlaceholder: "criadorhistorias",
        emailLabel: "E-mail",
        emailPlaceholder: "voce@exemplo.com",
        passwordLabel: "Senha",
        passwordPlaceholder: "Crie uma senha",
        submit: "Criar conta",
        success: "Conta criada para {username}",
      },
    },
    bookCard: {
      openBook: "Abrir livro",
      by: "por",
    },
  },
}

const CATEGORY_TRANSLATIONS: Record<AppLocale, Record<Category, string>> = {
  en: {
    Fiction: "Fiction",
    "Non-Fiction": "Non-Fiction",
    Science: "Science",
    Technology: "Technology",
    "Arts & Design": "Arts & Design",
    History: "History",
    Philosophy: "Philosophy",
    Education: "Education",
    Travel: "Travel",
    Cooking: "Cooking",
    "Health & Wellness": "Health & Wellness",
    Business: "Business",
    Poetry: "Poetry",
    Children: "Children",
    "Comics & Manga": "Comics & Manga",
    Other: "Other",
  },
  es: {
    Fiction: "Ficción",
    "Non-Fiction": "No ficción",
    Science: "Ciencia",
    Technology: "Tecnología",
    "Arts & Design": "Arte y diseño",
    History: "Historia",
    Philosophy: "Filosofía",
    Education: "Educación",
    Travel: "Viajes",
    Cooking: "Cocina",
    "Health & Wellness": "Salud y bienestar",
    Business: "Negocios",
    Poetry: "Poesía",
    Children: "Infantil",
    "Comics & Manga": "Cómics y manga",
    Other: "Otro",
  },
  fr: {
    Fiction: "Fiction",
    "Non-Fiction": "Essais",
    Science: "Science",
    Technology: "Technologie",
    "Arts & Design": "Arts et design",
    History: "Histoire",
    Philosophy: "Philosophie",
    Education: "Éducation",
    Travel: "Voyage",
    Cooking: "Cuisine",
    "Health & Wellness": "Santé et bien-être",
    Business: "Business",
    Poetry: "Poésie",
    Children: "Jeunesse",
    "Comics & Manga": "BD et manga",
    Other: "Autre",
  },
  de: {
    Fiction: "Fiktion",
    "Non-Fiction": "Sachbuch",
    Science: "Wissenschaft",
    Technology: "Technologie",
    "Arts & Design": "Kunst und Design",
    History: "Geschichte",
    Philosophy: "Philosophie",
    Education: "Bildung",
    Travel: "Reisen",
    Cooking: "Kochen",
    "Health & Wellness": "Gesundheit und Wohlbefinden",
    Business: "Wirtschaft",
    Poetry: "Poesie",
    Children: "Kinder",
    "Comics & Manga": "Comics und Manga",
    Other: "Andere",
  },
  pt: {
    Fiction: "Ficção",
    "Non-Fiction": "Não ficção",
    Science: "Ciência",
    Technology: "Tecnologia",
    "Arts & Design": "Arte e design",
    History: "História",
    Philosophy: "Filosofia",
    Education: "Educação",
    Travel: "Viagem",
    Cooking: "Culinária",
    "Health & Wellness": "Saúde e bem-estar",
    Business: "Negócios",
    Poetry: "Poesia",
    Children: "Infantil",
    "Comics & Manga": "Quadrinhos e mangá",
    Other: "Outro",
  },
}

export function getDictionary(locale: AppLocale): Dictionary {
  return DICTIONARIES[locale]
}

export function getIntlLocale(locale: AppLocale): string {
  return DICTIONARIES[locale].meta.intlLocale
}

export function getCategoryLabel(locale: AppLocale, category?: string | null): string | undefined {
  if (!category) return undefined
  const labels = CATEGORY_TRANSLATIONS[locale]
  return labels[category as Category] ?? category
}

export function getRoleLabel(locale: AppLocale, role: "admin" | "user"): string {
  return DICTIONARIES[locale].roles[role]
}

export function formatMessage(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key]
    return value === undefined ? `{${key}}` : String(value)
  })
}
