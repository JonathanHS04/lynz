"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { getRatingFont } from '@/utils/getRatingStyle';
import { Star } from 'lucide-react';
import Link from 'next/link';
import RatingButton from '@/components/RatingButton';
import InteractiveRating from '@/components/InteractiveRating';
import Tracklist from '@/components/Tracklist';
import RatingAndQuickActions from '@/components/RatingAndQuickActions';
import RankingInfo from '@/components/RankingInfo';
import Profile from '@/components/Profile';
import UserReviewsPanel from '@/components/UserReviewsPanel';
import SonicProfile from '@/components/SonicProfile';

const albums = [
    {
        id: 101,
        title: "POR SI MAÑANA NO ESTOY",
        artist: "Omar Courtz",
        artistId: 1,
        releaseDate: "2026 • 18 canciones • 1 h 10 min",
        genre: "Urbano Latino / Experimental",
        image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg",
        rating: 9.4,
        description: "Tras el éxito de 'PRIMERA MUSA', Omar Courtz redefine su sonido con una propuesta experimental y cinematográfica.",
        tracks: [
            { id: 1, artist: "Omar Courtz", title: "OUTRO", duration: "4:01", plays: "3.4M", rating: 8.9, features: [] },
            { id: 2, artist: "Omar Courtz", title: "EL MUNDO SE VA A ACABAR", duration: "3:34", plays: "12M", rating: 9.2, features: ["KARBeats"] },
            { id: 3, artist: "Omar Courtz", title: "FOREVER TU GANTEL", duration: "3:47", plays: "20M", rating: 9.5, features: ["Ñengo Flow"] },
            { id: 4, artist: "Omar Courtz", title: "L a k e n o s h i", duration: "3:28", plays: "9.7M", rating: 8.8, features: [] },
            { id: 5, artist: "Omar Courtz", title: "VAMOaCOCHI", duration: "3:20", plays: "8.1M", rating: 9.0, features: [] },
            { id: 6, artist: "Omar Courtz", title: "SUSU", duration: "3:00", plays: "4M", rating: 8.5, features: [] },
            { id: 7, artist: "Omar Courtz", title: "SIRENA", duration: "3:37", plays: "4.6M", rating: 8.7, features: [] },
            { id: 8, artist: "Omar Courtz", title: "GANTEL y BELLAKz", duration: "3:35", plays: "2.5M", rating: 8.4, features: ["Bassyy"] },
            { id: 9, artist: "Omar Courtz", title: "SI ESTÁS CON ALGUIEN", duration: "4:12", plays: "15M", rating: 9.3, features: [] },
            { id: 10, artist: "Omar Courtz", title: "Dulces SueñoZzz (+INTERLUDIO)", duration: "5:52", plays: "4M", rating: 9.6, features: ["Rubí"] },
            { id: 11, artist: "Omar Courtz", title: "$UELTA GATITA $UELTA", duration: "3:52", plays: "7.6M", rating: 9.1, features: ["Dei V", "Clarent", "Tito El Bambino"] },
            { id: 12, artist: "Omar Courtz", title: "WHAT U NEED? (SexPlaylist 2)", duration: "4:26", plays: "12M", rating: 9.4, features: ["Myke Towers"] },
            { id: 13, artist: "Omar Courtz", title: "WO OH OH", duration: "4:30", plays: "24M", rating: 9.7, features: ["ROA"] },
            { id: 14, artist: "Omar Courtz", title: "KOKO", duration: "3:16", plays: "21M", rating: 8.6, features: [] },
            { id: 15, artist: "Omar Courtz", title: "COMERNOS", duration: "3:42", plays: "41M", rating: 9.9, features: ["Bad Gyal"] },
            { id: 16, artist: "Omar Courtz", title: "SKY", duration: "3:34", plays: "5.3M", rating: 8.9, features: [] },
            { id: 17, artist: "Omar Courtz", title: "MOONLIGHT", duration: "4:16", plays: "4.8M", rating: 9.3, features: ["Eladio Carrión"] },
            { id: 18, artist: "Omar Courtz", title: "POR SI MAÑANA NO ESTOY", duration: "4:25", plays: "31M", rating: 9.8, features: [] }
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
    },
    {
        id: 201,
        title: "Blurryface",
        artist: "Twenty One Pilots",
        artistId: 2,
        releaseDate: "2015 • 14 canciones • 52 min",
        genre: "Alternative Rock / Indie Pop",
        image: "https://i.scdn.co/image/ab67616d00001e022df0d98a423025032d0db1f7",
        rating: 9.7,
        description: "El álbum que llevó a Twenty One Pilots a la cima del rock alternativo. Contiene algunos de los singles más exitosos de la banda como Stressed Out y Ride.",
        tracks: [
            { id: 1, artist: "Twenty One Pilots", title: "Heavydirtysoul", duration: "3:53", plays: "320M", rating: 8.9, features: [] },
            { id: 2, artist: "Twenty One Pilots", title: "Stressed Out", duration: "3:22", plays: "2.9B", rating: 9.8, features: [] },
            { id: 3, artist: "Twenty One Pilots", title: "Ride", duration: "3:34", plays: "2.2B", rating: 9.6, features: [] },
            { id: 4, artist: "Twenty One Pilots", title: "Fairly Local", duration: "3:27", plays: "410M", rating: 8.7, features: [] },
            { id: 5, artist: "Twenty One Pilots", title: "Tear in My Heart", duration: "3:08", plays: "680M", rating: 9.1, features: [] },
            { id: 6, artist: "Twenty One Pilots", title: "Lane Boy", duration: "4:13", plays: "390M", rating: 8.8, features: [] },
            { id: 7, artist: "Twenty One Pilots", title: "The Judge", duration: "5:24", plays: "510M", rating: 9.3, features: [] },
            { id: 8, artist: "Twenty One Pilots", title: "Doubt", duration: "3:02", plays: "465M", rating: 9.0, features: [] },
            { id: 9, artist: "Twenty One Pilots", title: "Polarize", duration: "3:18", plays: "350M", rating: 8.6, features: [] },
            { id: 10, artist: "Twenty One Pilots", title: "We Don't Believe What's on TV", duration: "2:51", plays: "290M", rating: 8.5, features: [] },
            { id: 11, artist: "Twenty One Pilots", title: "Message Man", duration: "3:36", plays: "310M", rating: 8.7, features: [] },
            { id: 12, artist: "Twenty One Pilots", title: "Ride", duration: "3:34", plays: "2.2B", rating: 9.6, features: [] },
            { id: 13, artist: "Twenty One Pilots", title: "Not Today", duration: "3:59", plays: "280M", rating: 8.4, features: [] },
            { id: 14, artist: "Twenty One Pilots", title: "Goner", duration: "4:07", plays: "420M", rating: 9.2, features: [] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#8' },
            { id: 2, title: 'Top del artista', rank: '#1' },
            { id: 3, title: 'Top del género', rank: '#2' },
        ],
        metrics: [
            { label: 'Ritmo', value: 8.9 },
            { label: 'Flow', value: 9.1 },
            { label: 'Letra', value: 9.6 },
            { label: 'Producción', value: 9.3 },
            { label: 'Impacto', value: 9.8 },
            { label: 'Innovación', value: 9.5 },
        ]
    },
    {
        id: 202,
        title: "Trench",
        artist: "Twenty One Pilots",
        artistId: 2,
        releaseDate: "2018 • 14 canciones • 56 min",
        genre: "Alternative Rock / Electropop",
        image: "https://i.scdn.co/image/ab67616d00001e02d1d301e737da4324479c6660",
        rating: 9.3,
        description: "El quinto álbum de Twenty One Pilots, un proyecto conceptual oscuro y cinematográfico que expandió el universo narrativo de la banda.",
        tracks: [
            { id: 1, artist: "Twenty One Pilots", title: "Jumpsuit", duration: "3:52", plays: "780M", rating: 9.3, features: [] },
            { id: 2, artist: "Twenty One Pilots", title: "Levitate", duration: "2:45", plays: "420M", rating: 8.8, features: [] },
            { id: 3, artist: "Twenty One Pilots", title: "Morph", duration: "3:42", plays: "310M", rating: 8.7, features: [] },
            { id: 4, artist: "Twenty One Pilots", title: "My Blood", duration: "3:56", plays: "560M", rating: 9.0, features: [] },
            { id: 5, artist: "Twenty One Pilots", title: "Chlorine", duration: "5:00", plays: "490M", rating: 9.1, features: [] },
            { id: 6, artist: "Twenty One Pilots", title: "Smithereens", duration: "3:08", plays: "380M", rating: 8.6, features: [] },
            { id: 7, artist: "Twenty One Pilots", title: "Neon Gravestones", duration: "4:55", plays: "340M", rating: 9.2, features: [] },
            { id: 8, artist: "Twenty One Pilots", title: "Cut My Lip", duration: "3:09", plays: "290M", rating: 8.5, features: [] },
            { id: 9, artist: "Twenty One Pilots", title: "Nico and the Niners", duration: "3:37", plays: "410M", rating: 8.9, features: [] },
            { id: 10, artist: "Twenty One Pilots", title: "Pet Cheetah", duration: "3:22", plays: "260M", rating: 8.4, features: [] },
            { id: 11, artist: "Twenty One Pilots", title: "Legend", duration: "3:27", plays: "450M", rating: 9.0, features: [] },
            { id: 12, artist: "Twenty One Pilots", title: "Leave the City", duration: "4:17", plays: "320M", rating: 8.8, features: [] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#15' },
            { id: 2, title: 'Top del artista', rank: '#2' },
            { id: 3, title: 'Top del género', rank: '#4' },
        ],
        metrics: [
            { label: 'Ritmo', value: 8.7 },
            { label: 'Flow', value: 8.9 },
            { label: 'Letra', value: 9.4 },
            { label: 'Producción', value: 9.1 },
            { label: 'Impacto', value: 9.0 },
            { label: 'Innovación', value: 9.3 },
        ]
    },

{
        id: 102,
        title: "PRIMERA MUSA",
        artist: "Omar Courtz",
        artistId: 1,
        releaseDate: "2024 • 17 canciones • 57 min",
        genre: "Reggaetón / Urbano Latino",
        image: "https://i.scdn.co/image/ab67616d00001e02996764071dbd5240eefb2422",
        rating: 9.1,
        description: "El EP que consolidó a Omar Courtz como una de las voces más importantes del urbano latino contemporáneo.",
        tracks: [
            { id: 1, artist: "Omar Courtz", title: "INTRO", duration: "1:30", plays: "2.1M", rating: 8.5, features: [] },
            { id: 2, artist: "Omar Courtz", title: "GODDESS", duration: "3:10", plays: "8.4M", rating: 8.9, features: [] },
            { id: 3, artist: "Omar Courtz", title: "HEAVY", duration: "3:22", plays: "6.7M", rating: 9.0, features: [] },
            { id: 4, artist: "Omar Courtz", title: "PIENSO EN SEXXXO", duration: "2:58", plays: "9.1M", rating: 9.2, features: [] },
            { id: 5, artist: "Omar Courtz", title: "UNA NOTi", duration: "3:05", plays: "5.3M", rating: 8.7, features: [] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#89' },
            { id: 2, title: 'Top del artista', rank: '#2' },
            { id: 3, title: 'Top del género', rank: '#11' },
        ],
        metrics: [
            { label: 'Ritmo', value: 9.0 },
            { label: 'Flow', value: 8.9 },
            { label: 'Letra', value: 7.8 },
            { label: 'Producción', value: 8.2 },
            { label: 'Impacto', value: 9.1 },
            { label: 'Innovación', value: 8.5 },
        ]
    },
    {
        id: 103,
        title: "UN VERANO SIN TI",
        artist: "Bad Bunny",
        artistId: 4,
        releaseDate: "2022 • 23 canciones • 1 h 21 min",
        genre: "Reggaetón / Pop Latino",
        image: "https://i.scdn.co/image/ab67616d00001e0249d694203245f241a1bcaa72",
        rating: 9.0,
        description: "El álbum más escuchado en la historia de Spotify. Bad Bunny entrega un verano de ritmos caribeños, reggaetón y exploración sonora.",
        tracks: [
            { id: 1, artist: "Bad Bunny", title: "Moscow Mule", duration: "4:38", plays: "890M", rating: 9.1, features: [] },
            { id: 2, artist: "Bad Bunny", title: "Después de la Playa", duration: "3:08", plays: "650M", rating: 8.8, features: [] },
            { id: 3, artist: "Bad Bunny", title: "Me Porto Bonito", duration: "2:59", plays: "1.4B", rating: 9.5, features: ["Chencho Corleone"] },
            { id: 4, artist: "Bad Bunny", title: "Tití Me Preguntó", duration: "4:03", plays: "1.2B", rating: 9.4, features: [] },
            { id: 5, artist: "Bad Bunny", title: "Efecto", duration: "3:26", plays: "820M", rating: 9.0, features: [] },
            { id: 6, artist: "Bad Bunny", title: "Party", duration: "3:39", plays: "560M", rating: 8.7, features: ["Rauw Alejandro"] },
            { id: 7, artist: "Bad Bunny", title: "Ojitos Lindos", duration: "4:50", plays: "740M", rating: 9.2, features: ["Bomba Estéreo"] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#3' },
            { id: 2, title: 'Top del artista', rank: '#1' },
            { id: 3, title: 'Top del género', rank: '#1' },
        ],
        metrics: [
            { label: 'Ritmo', value: 9.4 },
            { label: 'Flow', value: 9.2 },
            { label: 'Letra', value: 8.8 },
            { label: 'Producción', value: 9.0 },
            { label: 'Impacto', value: 9.8 },
            { label: 'Innovación', value: 8.9 },
        ]
    },
    {
        id: 104,
        title: "SATURNO",
        artist: "Rauw Alejandro",
        artistId: 5,
        releaseDate: "2022 • 18 canciones • 54 min",
        genre: "Urbano Latino / R&B",
        image: "https://i.scdn.co/image/ab67616d00001e02ee607f4ec65e7c54610be8b1",
        rating: 8.8,
        description: "El tercer álbum de Rauw Alejandro, nominado al Grammy. Una propuesta que fusiona el reggaetón con el R&B y la electrónica.",
        tracks: [
            { id: 1, artist: "Rauw Alejandro", title: "SATURNO", duration: "2:58", plays: "180M", rating: 8.7, features: [] },
            { id: 2, artist: "Rauw Alejandro", title: "Lokera", duration: "3:12", plays: "420M", rating: 9.0, features: ["Lyanno", "Brray"] },
            { id: 3, artist: "Rauw Alejandro", title: "Punto 40", duration: "3:28", plays: "380M", rating: 9.1, features: ["Baby Rasta"] },
            { id: 4, artist: "Rauw Alejandro", title: "Dime Quién????", duration: "2:51", plays: "220M", rating: 8.6, features: [] },
            { id: 5, artist: "Rauw Alejandro", title: "Lejos del Cielo", duration: "3:44", plays: "190M", rating: 8.8, features: [] },
            { id: 6, artist: "Rauw Alejandro", title: "Panties y Brasieres", duration: "3:05", plays: "310M", rating: 8.9, features: ["Jhay Cortez"] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#22' },
            { id: 2, title: 'Top del artista', rank: '#1' },
            { id: 3, title: 'Top del género', rank: '#6' },
        ],
        metrics: [
            { label: 'Ritmo', value: 9.1 },
            { label: 'Flow', value: 8.8 },
            { label: 'Letra', value: 8.3 },
            { label: 'Producción', value: 9.0 },
            { label: 'Impacto', value: 8.7 },
            { label: 'Innovación', value: 8.9 },
        ]
    },
    {
        id: 105,
        title: "EL ÚLTIMO TOUR DEL MUNDO",
        artist: "Bad Bunny",
        artistId: 4,
        releaseDate: "2020 • 16 canciones • 47 min",
        genre: "Trap Latino / Rock",
        image: "https://i.scdn.co/image/ab67616d00001e02005ee342f4eef2cc6e8436ab",
        rating: 8.7,
        description: "El primer álbum en español en llegar al #1 del Billboard 200. Bad Bunny experimenta con el rock alternativo y el trap.",
        tracks: [
            { id: 1, artist: "Bad Bunny", title: "El Mundo es Mío", duration: "2:54", plays: "310M", rating: 8.6, features: [] },
            { id: 2, artist: "Bad Bunny", title: "Dakiti", duration: "3:37", plays: "1.8B", rating: 9.4, features: ["Jhay Cortez"] },
            { id: 3, artist: "Bad Bunny", title: "Booker T", duration: "2:48", plays: "280M", rating: 8.5, features: [] },
            { id: 4, artist: "Bad Bunny", title: "Lo Siento BB:/", duration: "3:20", plays: "520M", rating: 8.9, features: ["Tainy", "Julieta Venegas"] },
            { id: 5, artist: "Bad Bunny", title: "Te Deseo Lo Mejor", duration: "3:12", plays: "390M", rating: 8.7, features: [] },
            { id: 6, artist: "Bad Bunny", title: "Yonaguni", duration: "2:56", plays: "680M", rating: 9.0, features: [] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#18' },
            { id: 2, title: 'Top del artista', rank: '#2' },
            { id: 3, title: 'Top del género', rank: '#3' },
        ],
        metrics: [
            { label: 'Ritmo', value: 8.8 },
            { label: 'Flow', value: 9.0 },
            { label: 'Letra', value: 8.6 },
            { label: 'Producción', value: 8.7 },
            { label: 'Impacto', value: 9.2 },
            { label: 'Innovación', value: 9.1 },
        ]
    },
    {
        id: 106,
        title: "YHLQMDLG",
        artist: "Bad Bunny",
        artistId: 4,
        releaseDate: "2020 • 20 canciones • 1 h 5 min",
        genre: "Reggaetón / Trap Latino",
        image: "https://i.scdn.co/image/ab67616d00001e02548f7ec52da7313de0c5e4a0",
        rating: 8.5,
        description: "Yo Hago Lo Que Me Da La Gana. Bad Bunny en su momento más irreverente, mezclando perreo clásico con trap y experimentación.",
        tracks: [
            { id: 1, artist: "Bad Bunny", title: "Si Veo a Tu Mamá", duration: "2:58", plays: "620M", rating: 8.8, features: [] },
            { id: 2, artist: "Bad Bunny", title: "La Difícil", duration: "3:20", plays: "480M", rating: 8.6, features: [] },
            { id: 3, artist: "Bad Bunny", title: "Yo Perreo Sola", duration: "3:33", plays: "890M", rating: 9.2, features: [] },
            { id: 4, artist: "Bad Bunny", title: "Ignorantes", duration: "3:32", plays: "540M", rating: 8.9, features: ["Sech"] },
            { id: 5, artist: "Bad Bunny", title: "Safaera", duration: "4:56", plays: "720M", rating: 9.3, features: ["Jowell & Randy", "Ñengo Flow"] },
            { id: 6, artist: "Bad Bunny", title: "Vete", duration: "3:18", plays: "410M", rating: 8.7, features: [] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#31' },
            { id: 2, title: 'Top del artista', rank: '#3' },
            { id: 3, title: 'Top del género', rank: '#5' },
        ],
        metrics: [
            { label: 'Ritmo', value: 9.2 },
            { label: 'Flow', value: 9.1 },
            { label: 'Letra', value: 8.4 },
            { label: 'Producción', value: 8.6 },
            { label: 'Impacto', value: 8.9 },
            { label: 'Innovación', value: 8.7 },
        ]
    },
    {
        id: 203,
        title: "Clancy",
        artist: "Twenty One Pilots",
        artistId: 2,
        releaseDate: "2024 • 13 canciones • 47 min",
        genre: "Alternative Rock / Electropop",
        image: "https://i.scdn.co/image/ab67616d00001e02cc94dd4730132ccfbd617bf9",
        rating: 8.9,
        description: "El séptimo álbum de Twenty One Pilots, conclusión del arco narrativo de Dema. Un trabajo conceptual que mezcla rock alternativo con electrónica.",
        tracks: [
            { id: 1, artist: "Twenty One Pilots", title: "Overcompensate", duration: "3:14", plays: "210M", rating: 9.1, features: [] },
            { id: 2, artist: "Twenty One Pilots", title: "Routines in the Night", duration: "3:28", plays: "180M", rating: 8.8, features: [] },
            { id: 3, artist: "Twenty One Pilots", title: "Paladin Strait", duration: "3:55", plays: "160M", rating: 9.0, features: [] },
            { id: 4, artist: "Twenty One Pilots", title: "Navigating", duration: "3:12", plays: "140M", rating: 8.6, features: [] },
            { id: 5, artist: "Twenty One Pilots", title: "Vignette", duration: "2:58", plays: "120M", rating: 8.5, features: [] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#19' },
            { id: 2, title: 'Top del artista', rank: '#3' },
            { id: 3, title: 'Top del género', rank: '#5' },
        ],
        metrics: [
            { label: 'Ritmo', value: 8.6 },
            { label: 'Flow', value: 8.8 },
            { label: 'Letra', value: 9.2 },
            { label: 'Producción', value: 9.0 },
            { label: 'Impacto', value: 8.8 },
            { label: 'Innovación', value: 9.1 },
        ]
    },
    {
        id: 204,
        title: "Breach",
        artist: "Twenty One Pilots",
        artistId: 2,
        releaseDate: "2025 • 13 canciones • 47 min",
        genre: "Alternative Rock / Pop Rock",
        image: "https://i.scdn.co/image/ab67616d00001e029c5a3160cc1a6ef5efdaf80a",
        rating: 9.0,
        description: "El octavo y último álbum de la saga de Dema. Debutó #1 en el Billboard 200 con las mayores ventas de vinilo de rock desde 1991.",
        tracks: [
            { id: 1, artist: "Twenty One Pilots", title: "City Walls", duration: "5:22", plays: "95M", rating: 9.2, features: [] },
            { id: 2, artist: "Twenty One Pilots", title: "RAWFEAR", duration: "3:18", plays: "88M", rating: 8.4, features: [] },
            { id: 3, artist: "Twenty One Pilots", title: "Drum Show", duration: "3:05", plays: "72M", rating: 9.1, features: [] },
            { id: 4, artist: "Twenty One Pilots", title: "Garbage", duration: "3:28", plays: "65M", rating: 8.1, features: [] },
            { id: 5, artist: "Twenty One Pilots", title: "The Contract", duration: "3:14", plays: "58M", rating: 8.8, features: [] },
            { id: 6, artist: "Twenty One Pilots", title: "Downstairs", duration: "5:26", plays: "58M", rating: 8.1, features: [] },
            { id: 7, artist: "Twenty One Pilots", title: "Robot Voices", duration: "3:57", plays: "58M", rating: 8.2, features: [] },
            { id: 8, artist: "Twenty One Pilots", title: "Center Mass", duration: "3:48", plays: "58M", rating: 8.8, features: [] },
            { id: 9, artist: "Twenty One Pilots", title: "Cottonwood", duration: "3:32", plays: "58M", rating: 8.5, features: [] },
            { id: 10, artist: "Twenty One Pilots", title: "One Way", duration: "2:43", plays: "58M", rating: 8.3, features: [] },
            { id: 11, artist: "Twenty One Pilots", title: "Days Lie Dormant", duration: "3:26", plays: "58M", rating: 8.3, features: [] },
            { id: 12, artist: "Twenty One Pilots", title: "Tally", duration: "3:08", plays: "58M", rating: 8.8, features: [] },
            { id: 13, artist: "Twenty One Pilots", title: "Intentions", duration: "2:15", plays: "58M", rating: 8.2, features: [] },
        ],
        rankings: [
            { id: 1, title: 'Top Global', rank: '#11' },
            { id: 2, title: 'Top del artista', rank: '#2' },
            { id: 3, title: 'Top del género', rank: '#3' },
        ],
        metrics: [
            { label: 'Ritmo', value: 8.8 },
            { label: 'Flow', value: 9.0 },
            { label: 'Letra', value: 9.3 },
            { label: 'Producción', value: 9.2 },
            { label: 'Impacto', value: 9.1 },
            { label: 'Innovación', value: 9.4 },
        ]
    },
];

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

export default function AlbumPage() {
    const params = useParams();
    const albumId = Number(params.albumId);
    const albumData = albums.find(a => a.id === albumId) || albums[0];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12">

            {/* --- HERO SECTION --- */}
            <header className="relative h-[60vh] flex items-end overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={albumData.image}
                        className="w-full h-full object-cover scale-110 blur-3xl opacity-30"
                        alt="Blur background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <div className="shrink-0 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden border border-white/10 w-64 h-64 md:w-80 md:h-80 transition-transform hover:scale-[1.02] duration-500">
                            <img src={albumData.image} className="w-full h-full object-cover" alt={albumData.title} />
                        </div>

                        <div className="flex-1 space-y-5">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                                {albumData.title}
                            </h1>

                            <div className="flex items-center gap-4 text-gray-400 font-medium">
                                <Link href={`/Artist/${albumData.artistId}`} className="cursor-pointer transition-colors text-lg text-white font-bold hover:text-violet-500">{albumData.artist}</Link>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="text-sm uppercase tracking-wider">{albumData.genre}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="text-sm">{albumData.releaseDate}</span>
                            </div>
                            <RatingAndQuickActions rating={albumData.rating} ratingHref={`/Reviews/Album/${albumData.id}`} />
                        </div>
                    </div>
                </div>
            </header>

            {/* --- CONTENT SECTION --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <Tracklist tracks={albumData.tracks}/>
                    <aside className="space-y-12">
                        <Profile data={albumData} />
                        <SonicProfile data={albumData} metrics={albumData.metrics} image={false}/>
                        <UserReviewsPanel reviews={userReviews} Id={albumData.id} type="Album" />
                    </aside>
                </div>
            </main>
        </div>
    );
}