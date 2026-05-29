"use client";
import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { Comment as CommentType } from '@repo/types';

// --- MOCK DATA ---
const initialComments: CommentType[] = [
  {
    id: "1",
    username: "Julian Casablancas",
    userImage: "https://i.pravatar.cc/150?u=julian",
    date: "Hace 2 horas",
    text: "La remasterización de 'Nude' es simplemente de otro planeta. Esos arpegios finales tienen una claridad que no existía en el release original de 2007.",
    likes: 24,
    replies: []
  },
  {
    id: "2",
    username: "Sofia Trend",
    userImage: "https://i.pravatar.cc/150?u=sofia",
    date: "Hace 5 horas",
    text: "¿Alguien más siente que el bajo en '15 Step' suena más presente? Creo que Godrich hizo un trabajo impecable balanceando las frecuencias bajas sin saturar.",
    likes: 12,
    replies: [
      {
        id: "3",
        username: "Alex Dev",
        userImage: "https://i.pravatar.cc/150?u=alex",
        date: "Hace 3 horas",
        text: "Totalmente de acuerdo. En monitores de estudio se nota muchísimo la separación de canales.",
        likes: 5
      }
    ]
  }
];

const Comment = ({ comment, isReply = false }: { comment: CommentType; isReply?: boolean }) => (
  <div className={`flex gap-4 ${isReply ? 'mt-6 ml-12 border-l border-white/5 pl-6' : 'mb-10'}`}>
    <img 
      src={comment.userImage} 
      alt={comment.username} 
      className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover border border-white/10`} 
    />
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">{comment.username}</span>
          <span className="text-xs text-gray-500">• {comment.date}</span>
        </div>
        <button className="text-gray-600 hover:text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <p className="text-gray-400 text-[15px] leading-relaxed mb-3">
        {comment.text}
      </p>
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-violet-400 transition-colors group">
          <Heart className="w-4 h-4 group-hover:fill-violet-400/20" />
          {comment.likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-white transition-colors">
          <MessageSquare className="w-4 h-4" />
          Responder
        </button>
        <button className="text-xs font-semibold text-gray-500 hover:text-white transition-colors">
          Compartir
        </button>
      </div>

      {/* Renderizar respuestas si existen */}
      {comment.replies && comment.replies.map((reply) => (
        <Comment key={reply.id} comment={reply} isReply={true} />
      ))}
    </div>
  </div>
);

export default function CommentsSection() {
  const [commentText, setCommentText] = useState("");
  const comments = initialComments; // En un caso real, esto vendría de props o de una consulta a la API

  return (
    <section className="mt-16 border-t border-white/5 pt-16">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          Comunidad <span className="text-sm font-normal text-gray-500">({comments.length} comentarios)</span>
        </h3>
        <div className="text-sm text-gray-400">
          Ordenar por: <span className="text-white font-medium cursor-pointer hover:text-violet-400">Más recientes</span>
        </div>
      </div>

      {/* Input de Comentario Principal */}
      <div className="mb-12">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-violet-500/20">
            J
          </div>
          <div className="flex-1">
            <textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Únete a la conversación..."
              className="w-full bg-[#111] border border-white/5 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none h-28"
            />
            <div className="flex justify-end mt-3">
              <button 
                disabled={!commentText}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white font-bold rounded-lg text-sm transition-all"
              >
                Publicar Comentario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Comentarios */}
      <div className="space-y-2">
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      
      {/* Botón Cargar Más */}
      <button className="w-full py-4 mt-8 border border-white/5 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/[0.02] hover:text-white transition-all">
        Cargar más comentarios
      </button>
    </section>
  );
}