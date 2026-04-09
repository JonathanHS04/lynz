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

const sonicProfile = [
    { label: 'Ritmo', value: 9.2 },
    { label: 'Flow', value: 8.8 },
    { label: 'Letra', value: 7.5 },
    { label: 'Producción', value: 7.3 },
    { label: 'Impacto', value: 9.6 },
    { label: 'Innovación', value: 8.1 },
];

const artistPerformance = [
    {
        id: 1,
        name: 'Omar Courtz',
        role: 'Main Artist',
        artistRating: 9.4,
        score: 9.8,
        image: 'https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages221/v4/f5/7c/21/f57c21d6-590a-b07e-1027-e92e6c62cfe6/ami-identity-cee5abcdd03c2870378144a376dce33d-2025-04-18T00-19-44.218Z_cropped.png/486x486bb.png',
    },
    {
        id: 2,
        name: 'Bad Gyal',
        role: 'Featuring',
        artistRating: 8.7,
        score: 8.9,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6v5uBzxRFt5jpsC33cGOUhBwB7NTSuoBo7A&s',
    },
];

const songData = {
    id: 15,
    title: "COMERNOS",
    artist: "Omar Courtz",
    artistId: 1,
    features: ["Bad Gyal"],
    album: "POR SI MAÑANA NO ESTOY",
    albumId: 1,
    duration: "3:42",
    releaseDate: "2026",
    plays: "41,203,554",
    rating: 9.9,
    genre: "Reggaetón / Experimental",
    producers: ["Haze", "Bassy", "Ninow y Candy"],
    image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg",
    lyrics: "Baby, yo sé que tú quieres...",
    description: "COMERNOS es el track más popular del álbum 'POR SI MAÑANA NO ESTOY' de Omar Courtz, lanzado en 2026. Con la colaboración de Bad Gyal, esta canción se ha convertido en un himno del reggaetón experimental, destacando por su producción innovadora y su ritmo pegajoso. El tema ha acumulado más de 41 millones de reproducciones, consolidándose como uno de los mayores éxitos del año."
};

export { userReviews, sonicProfile, artistPerformance, songData };