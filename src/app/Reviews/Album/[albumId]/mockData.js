// --- SONG DATA ---
export const songData = {
    id: 15,
    title: "COMERNOS",
    artist: "Omar Courtz",
    artistId: 1,
    features: [
        { id: 2, name: "Bad Gyal" }
    ],
    album: "POR SI MAÑANA NO ESTOY",
    albumId: 101,
    duration: "3:42",
    releaseDate: "2026",
    plays: "41,203,554",
    rating: 9.9,
    genre: "Reggaetón / Experimental",
    producers: ["Haze", "Bassy", "Ninow y Candy"],
    image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg",
};


// --- ALBUM DATA ---
export const albumData = {
    id: 101,
    title: "POR SI MAÑANA NO ESTOY",
    artist: "Omar Courtz",
    artistId: 1,
    releaseDate: "2026 • 18 canciones • 1 h 10 min",
    genre: "Urbano Latino / Experimental",
    image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg",
    rating: 9.4,
    description:
        "Tras el éxito de 'PRIMERA MUSA', Omar Courtz redefine su sonido con una propuesta experimental y cinematográfica.",
    tracks: [
        { id: 1, title: "OUTRO", duration: "4:01", plays: "3.4M", rating: 8.9, features: [] },
        { id: 2, title: "EL MUNDO SE VA A ACABAR", duration: "3:34", plays: "12M", rating: 9.2, features: ["KARBeats"] },
        { id: 3, title: "FOREVER TU GANTEL", duration: "3:47", plays: "20M", rating: 9.5, features: ["Ñengo Flow"] },
        { id: 4, title: "L a k e n o s h i", duration: "3:28", plays: "9.7M", rating: 8.8, features: [] },
        { id: 5, title: "VAMOaCOCHI", duration: "3:20", plays: "8.1M", rating: 9.0, features: [] },
        { id: 6, title: "SUSU", duration: "3:00", plays: "4M", rating: 8.5, features: [] },
        { id: 7, title: "SIRENA", duration: "3:37", plays: "4.6M", rating: 8.7, features: [] },
        { id: 8, title: "GANTEL y BELLAKz", duration: "3:35", plays: "2.5M", rating: 8.4, features: ["Bassyy"] },
        { id: 9, title: "SI ESTÁS CON ALGUIEN", duration: "4:12", plays: "15M", rating: 9.3, features: [] },
        { id: 10, title: "Dulces SueñoZzz (+INTERLUDIO)", duration: "5:52", plays: "4M", rating: 9.6, features: ["Rubí"] },
        { id: 11, title: "$UELTA GATITA $UELTA", duration: "3:52", plays: "7.6M", rating: 9.1, features: ["Dei V", "Clarent", "Tito El Bambino"] },
        { id: 12, title: "WHAT U NEED?", duration: "4:26", plays: "12M", rating: 9.4, features: ["Myke Towers"] },
        { id: 13, title: "WO OH OH", duration: "4:30", plays: "24M", rating: 9.7, features: ["ROA"] },
        { id: 14, title: "KOKO", duration: "3:16", plays: "21M", rating: 8.6, features: [] },
        { id: 15, title: "COMERNOS", duration: "3:42", plays: "41M", rating: 9.9, features: ["Bad Gyal"] },
        { id: 16, title: "SKY", duration: "3:34", plays: "5.3M", rating: 8.9, features: [] },
        { id: 17, title: "MOONLIGHT", duration: "4:16", plays: "4.8M", rating: 9.3, features: ["Eladio Carrión"] },
        { id: 18, title: "POR SI MAÑANA NO ESTOY", duration: "4:25", plays: "31M", rating: 9.8, features: [] }
    ],
    metrics: [
        { label: 'Ritmo', value: 9.2 },
        { label: 'Flow', value: 8.8 },
        { label: 'Letra', value: 7.5 },
        { label: 'Producción', value: 7.3 },
        { label: 'Impacto', value: 9.6 },
        { label: 'Innovación', value: 8.1 },
    ]
};


// --- REVIEWS (REUTILIZABLES PARA TODO) ---
export const userReviews = [
    {
        id: 1,
        username: "Lucia.mp3",
        avatar: "https://avatar.vercel.sh/lucia",
        rating: 9.6,
        date: "2026-04-11T10:00:00Z",
        likes: 31,
        comments: 4,
        text: "El álbum se siente coherente de principio a fin. Tiene un tono oscuro muy claro y varios picos que sí justifican el hype. La narrativa sonora está muy bien construida.",
    },
    {
        id: 2,
        username: "NicoLynz",
        avatar: "https://avatar.vercel.sh/nico",
        rating: 8.9,
        date: "2026-04-11T07:00:00Z",
        likes: 18,
        comments: 2,
        text: "No todos los tracks pegan igual, pero cuando encuentra el mood correcto el proyecto está muy por encima de la media. Se siente cuidado.",
    },
    {
        id: 3,
        username: "Sofia.wav",
        avatar: "https://avatar.vercel.sh/sofia",
        rating: 9.3,
        date: "2026-04-10T12:00:00Z",
        likes: 22,
        comments: 6,
        text: "Producción muy cuidada, buenos feats y una identidad visual-sonora bastante marcada. Se siente como una era, no solo un drop.",
    },
    {
        id: 4,
        username: "DripSense",
        avatar: "https://avatar.vercel.sh/drip",
        rating: 7.8,
        date: "2026-04-10T08:00:00Z",
        likes: 9,
        comments: 1,
        text: "Buen proyecto pero siento que se alarga en algunas partes. Aun así tiene highlights fuertes.",
    },
    {
        id: 5,
        username: "AnalogKid",
        avatar: "https://avatar.vercel.sh/analog",
        rating: 9.8,
        date: "2026-04-09T09:00:00Z",
        likes: 44,
        comments: 8,
        text: "Uno de los discos más interesantes del año. La producción y el concepto están a otro nivel.",
    },
    {
        id: 6,
        username: "Waveform",
        avatar: "https://avatar.vercel.sh/wave",
        rating: 8.4,
        date: "2026-04-08T11:00:00Z",
        likes: 12,
        comments: 3,
        text: "Muy buen sonido, aunque algunas letras no me terminaron de convencer.",
    }
];