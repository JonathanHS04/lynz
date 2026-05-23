const albumData = {
    title: "POR SI MAÑANA NO ESTOY",
    artist: "Omar Courtz",
    artistId: 1,
    releaseYear: "2026",
    totalDuration: 200000,
    genre: "Urbano Latino / Experimental",
    image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg",
    rating: 9.4,
    tracks: [
        { id: 1, artist: "Omar Courtz", title: "OUTRO", duration: 24100, rating: 8.9, features: [] },
        { id: 2, artist: "Omar Courtz", title: "EL MUNDO SE VA A ACABAR", duration: 214000, rating: 9.2, features: ["KARBeats"] },
        { id: 3, artist: "Omar Courtz", title: "FOREVER TU GANTEL", duration: 227000, rating: 9.5, features: ["Ñengo Flow"] },
        { id: 4, artist: "Omar Courtz", title: "L a k e n o s h i", duration: 208000, rating: 8.8, features: [] },
        { id: 5, artist: "Omar Courtz", title: "VAMOaCOCHI", duration: 200000, rating: 9.0, features: [] },
        { id: 6, artist: "Omar Courtz", title: "SUSU", duration: 180000, rating: 8.5, features: [] },
        { id: 7, artist: "Omar Courtz", title: "SIRENA", duration: 217000, rating: 8.7, features: [] },
        { id: 8, artist: "Omar Courtz", title: "GANTEL y BELLAKz", duration: 215000, rating: 8.4, features: ["Bassyy"] },
        { id: 9, artist: "Omar Courtz", title: "SI ESTÁS CON ALGUIEN", duration: 252000, rating: 9.3, features: [] },
        { id: 10, artist: "Omar Courtz", title: "Dulces SueñoZzz (+INTERLUDIO)", duration: 352000, rating: 9.6, features: ["Rubí"] },
        { id: 11, artist: "Omar Courtz", title: "$UELTA GATITA $UELTA", duration: 232000,  rating: 9.1, features: ["Dei V", "Clarent", "Tito El Bambino"] },
        { id: 12, artist: "Omar Courtz", title: "WHAT U NEED? (SexPlaylist 2)", duration: 266000, rating: 9.4, features: ["Myke Towers"] },
        { id: 13, artist: "Omar Courtz", title: "WO OH OH", duration: 270000, rating: 9.7, features: ["ROA"] },
        { id: 14, artist: "Omar Courtz", title: "KOKO", duration: 196000, rating: 8.6, features: [] },
        { id: 15, artist: "Omar Courtz", title: "COMERNOS", duration: 222000, rating: 9.9, features: ["Bad Gyal"] },
        { id: 16, artist: "Omar Courtz", title: "SKY", duration: 214000, rating: 8.9, features: [] },
        { id: 17, artist: "Omar Courtz", title: "MOONLIGHT", duration: 256000, rating: 9.3, features: ["Eladio Carrión"] },
        { id: 18, artist: "Omar Courtz", title: "LAPOR SI MAÑANA NO ESTOY", duration: 265000, rating: 9.8, features: [] }
    ],
    rankings: [
        { id: 1, title: 'Top Global', rank: '#56' },
        { id: 2, title: 'Top del artista', rank: '#1' },
        { id: 3, title: 'Top del género', rank: '#4' },
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

const userReviews = [
    {
        id: 1,
        username: 'Lucia.mp3',
        avatar: 'https://avatar.vercel.sh/lucia',
        rating: 9.6,
        timeAgo: 'Hace 2 horas',
        likes: 31,
        comments: 4,
        text: 'El álbum se siente coherente de principio a fin. Tiene un tono oscuro muy claro y varios picos que sí justifican el hype.',
    },
    {
        id: 2,
        username: 'NicoLynz',
        avatar: 'https://avatar.vercel.sh/nico',
        rating: 8.9,
        timeAgo: 'Hace 5 horas',
        likes: 18,
        comments: 2,
        text: 'No todos los tracks pegan igual, pero cuando encuentra el mood correcto el proyecto está muy por encima de la media.',
    },
    {
        id: 3,
        username: 'Sofia.wav',
        avatar: 'https://avatar.vercel.sh/sofia',
        rating: 9.3,
        timeAgo: 'Ayer',
        likes: 22,
        comments: 6,
        text: 'Producción muy cuidada, buenos feats y una identidad visual-sonora bastante marcada. Se siente como una era, no solo un drop.',
    }
];

export { albumData, userReviews };