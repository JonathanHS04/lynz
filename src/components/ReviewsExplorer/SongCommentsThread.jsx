"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
    ArrowDownWideNarrow,
    ChevronDown,
    ChevronUp,
    Heart,
    MoreHorizontal,
} from "lucide-react";
import MiniSonicProfile from "@/components/MiniSonicProfile";
import RatingSquare from "@/components/Rating/RatingSquare";
import ArtistsPerformanceMini from "../ArtistsPerformanceMini";

const REFERENCE_NOW = new Date("2026-04-11T12:00:00Z").getTime();

const currentUser = {
    username: "Tú",
    avatar: null,
    initials: "J",
};

const formatStaticTimeLabel = (dateInput) => {
    if (!dateInput) return "ahora";

    const timestamp = new Date(dateInput).getTime();
    if (Number.isNaN(timestamp)) return "ahora";

    const diffInHours = Math.max(0, Math.floor((REFERENCE_NOW - timestamp) / (1000 * 60 * 60)));

    if (diffInHours < 1) return "hace un momento";
    if (diffInHours < 24) return `hace ${diffInHours} h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;

    return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(timestamp));
};

const normalizeComments = (comments = []) =>
    comments.map((comment) => ({
        id: comment.id,
        username: comment.username,
        avatar: comment.avatar ?? null,
        text: comment.text,
        rating: comment.rating ?? null,
        likes: comment.likes ?? 0,
        liked: false,
        timeLabel: comment.timeLabel ?? formatStaticTimeLabel(comment.date),
        sortStamp: Number.isNaN(new Date(comment.date).getTime())
            ? REFERENCE_NOW
            : new Date(comment.date).getTime(),
        replying: false,
        replyDraft: "",
        repliesExpanded: true,
        replies: normalizeComments(comment.replies ?? []),
    }));

const getMaxCommentId = (comments = []) =>
    comments.reduce((maxId, comment) => {
        const replyMax = getMaxCommentId(comment.replies ?? []);
        return Math.max(maxId, comment.id, replyMax);
    }, 0);

const countAllComments = (comments = []) =>
    comments.reduce((total, comment) => total + 1 + countAllComments(comment.replies ?? []), 0);

const sortThread = (comments, sortMode) => {
    const sorted = [...comments];

    sorted.sort((a, b) => {
        if (sortMode === "newest") return b.sortStamp - a.sortStamp;
        if (b.likes !== a.likes) return b.likes - a.likes;
        return b.sortStamp - a.sortStamp;
    });

    return sorted.map((comment) => ({
        ...comment,
        replies: sortThread(comment.replies ?? [], sortMode),
    }));
};

const updateCommentTree = (comments, commentId, updater) =>
    comments.map((comment) => {
        if (comment.id === commentId) {
            return updater(comment);
        }

        if (comment.replies?.length) {
            return {
                ...comment,
                replies: updateCommentTree(comment.replies, commentId, updater),
            };
        }

        return comment;
    });

const addReplyToTree = (comments, parentId, reply) =>
    comments.map((comment) => {
        if (comment.id === parentId) {
            return {
                ...comment,
                replying: false,
                replyDraft: "",
                repliesExpanded: true,
                replies: [...comment.replies, reply],
            };
        }

        if (comment.replies?.length) {
            return {
                ...comment,
                replies: addReplyToTree(comment.replies, parentId, reply),
            };
        }

        return comment;
    });

const Avatar = ({ username, avatar, initials = "U", size = "md" }) => {
    const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

    if (avatar) {
        return (
            <img
                src={avatar}
                alt={username}
                className={`${sizeClass} shrink-0 rounded-full border border-white/10 object-cover`}
            />
        );
    }

    return (
        <div
            className={`${sizeClass} shrink-0 rounded-full border border-violet-500/30 bg-violet-500/15 font-black uppercase text-violet-200 flex items-center justify-center`}
        >
            {initials}
        </div>
    );
};

const ReplyComposer = ({ value, onChange, onCancel, onSubmit }) => (
    <div className="mt-4 flex gap-3">
        <Avatar username={currentUser.username} initials={currentUser.initials} size="sm" />
        <div className="flex-1">
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={1}
                placeholder="Añade una respuesta..."
                className="min-h-[42px] w-full resize-none border-b border-white/10 bg-transparent pb-3 text-sm text-white placeholder:text-zinc-500 focus:border-white/35 focus:outline-none"
            />
            <div className="mt-3 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!value.trim()}
                    className="rounded-full bg-violet-500 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Responder
                </button>
            </div>
        </div>
    </div>
);

const CommentItem = ({
    comment,
    depth = 0,
    defaultSonicProfile = [],
    artistsPerformance = [],
    sonicImage,
    sonicTitle,
    sonicSubtitle,
    onToggleLike,
    onToggleReply,
    onReplyDraftChange,
    onSubmitReply,
    onToggleReplies,
}) => {
    const isNested = depth > 0;

    return (
        <article className={isNested ? "mt-5" : ""}>
            <div className="flex gap-3 sm:gap-4">
                <Avatar
                    username={comment.username}
                    avatar={comment.avatar}
                    initials={comment.username.slice(0, 1)}
                    size={isNested ? "sm" : "md"}
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Link
                                href={`/User/${comment.username}`}
                                className="font-black text-white hover:text-violet-300"
                            >
                                {comment.username}
                            </Link>
                            <span className="text-xs text-zinc-500">{comment.timeLabel}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {!isNested && typeof comment.rating === "number" && Number.isFinite(comment.rating) && (
                                <RatingSquare rating={comment.rating} variant="inline" />
                            )}

                            <button
                                type="button"
                                className="rounded-full p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <p className="mt-1 max-w-[83%] whitespace-pre-wrap text-[15px] leading-6 text-zinc-200">
                        {comment.text}
                    </p>

                    {!isNested && defaultSonicProfile.length > 0 && (
                        <>
                        <MiniSonicProfile
                            metrics={defaultSonicProfile}
                            image={sonicImage}
                            title={sonicTitle}
                            subtitle={sonicSubtitle}
                        />
                        <ArtistsPerformanceMini artistsPerformance={artistsPerformance} />
                        </>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onToggleLike(comment.id)}
                            className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${comment.liked
                                    ? "text-violet-300"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                        >
                            <Heart className={`h-4 w-4 ${comment.liked ? "fill-violet-400 text-violet-400" : ""}`} />
                            <span>{comment.likes}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onToggleReply(comment.id)}
                            className="rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Responder
                        </button>
                    </div>

                    {comment.replying && (
                        <ReplyComposer
                            value={comment.replyDraft}
                            onChange={(value) => onReplyDraftChange(comment.id, value)}
                            onCancel={() => onToggleReply(comment.id)}
                            onSubmit={() => onSubmitReply(comment.id, comment.replyDraft)}
                        />
                    )}

                    {comment.replies.length > 0 && (
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => onToggleReplies(comment.id)}
                                className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-black text-sky-400 transition hover:bg-sky-500/10"
                            >
                                {comment.repliesExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                                <span>
                                    {comment.repliesExpanded ? "Ocultar" : "Ver"} {comment.replies.length} {comment.replies.length === 1 ? "respuesta" : "respuestas"}
                                </span>
                            </button>
                        </div>
                    )}

                    {comment.repliesExpanded && comment.replies.length > 0 && (
                        <div className="mt-4 border-l border-white/8 pl-4 sm:pl-6">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    depth={depth + 1}
                                    defaultSonicProfile={defaultSonicProfile}
                                    sonicImage={sonicImage}
                                    sonicTitle={sonicTitle}
                                    sonicSubtitle={sonicSubtitle}
                                    onToggleLike={onToggleLike}
                                    onToggleReply={onToggleReply}
                                    onReplyDraftChange={onReplyDraftChange}
                                    onSubmitReply={onSubmitReply}
                                    onToggleReplies={onToggleReplies}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

const SongCommentsThread = ({ artistsPerformance = [], initialComments = [], defaultSonicProfile = [], sonicImage, sonicTitle, sonicSubtitle }) => {
    const [sortMode, setSortMode] = useState("top");
    const [composerActive, setComposerActive] = useState(false);
    const [newCommentText, setNewCommentText] = useState("");
    const [comments, setComments] = useState(() => normalizeComments(initialComments));
    const nextCommentId = useRef(getMaxCommentId(normalizeComments(initialComments)) + 1);

    const commentCount = useMemo(() => countAllComments(comments), [comments]);
    const sortedComments = useMemo(() => sortThread(comments, sortMode), [comments, sortMode]);

    const createComment = (text) => ({
        id: nextCommentId.current++,
        username: currentUser.username,
        avatar: currentUser.avatar,
        text: text.trim(),
        rating: null,
        likes: 0,
        liked: false,
        timeLabel: "ahora",
        sortStamp: Date.now(),
        replying: false,
        replyDraft: "",
        repliesExpanded: true,
        replies: [],
    });

    const handlePublishComment = () => {
        if (!newCommentText.trim()) return;

        setComments((currentComments) => [createComment(newCommentText), ...currentComments]);
        setNewCommentText("");
        setComposerActive(false);
    };

    const handleToggleLike = (commentId) => {
        setComments((currentComments) =>
            updateCommentTree(currentComments, commentId, (comment) => {
                if (comment.liked) {
                    return {
                        ...comment,
                        liked: false,
                        likes: Math.max(0, comment.likes - 1),
                    };
                }

                return {
                    ...comment,
                    liked: true,
                    likes: comment.likes + 1,
                };
            })
        );
    };

    const handleToggleReply = (commentId) => {
        setComments((currentComments) =>
            updateCommentTree(currentComments, commentId, (comment) => ({
                ...comment,
                replying: !comment.replying,
                replyDraft: comment.replying ? "" : comment.replyDraft,
            }))
        );
    };

    const handleReplyDraftChange = (commentId, value) => {
        setComments((currentComments) =>
            updateCommentTree(currentComments, commentId, (comment) => ({
                ...comment,
                replyDraft: value,
            }))
        );
    };

    const handleSubmitReply = (commentId, value) => {
        if (!value.trim()) return;

        setComments((currentComments) => addReplyToTree(currentComments, commentId, createComment(value)));
    };

    const handleToggleReplies = (commentId) => {
        setComments((currentComments) =>
            updateCommentTree(currentComments, commentId, (comment) => ({
                ...comment,
                repliesExpanded: !comment.repliesExpanded,
            }))
        );
    };

    return (
        <section className="pb-12">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black tracking-tight text-white">
                            {commentCount} comentarios
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <ArrowDownWideNarrow className="h-4 w-4" />
                        <button
                            type="button"
                            onClick={() => setSortMode((current) => (current === "top" ? "newest" : "top"))}
                            className="font-black uppercase tracking-[0.18em] text-zinc-300 transition hover:text-white"
                        >
                            Ordenar por: {sortMode === "top" ? "principales" : "más recientes"}
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Avatar username={currentUser.username} initials={currentUser.initials} />

                    <div className="flex-1">
                        <textarea
                            value={newCommentText}
                            onFocus={() => setComposerActive(true)}
                            onChange={(event) => setNewCommentText(event.target.value)}
                            rows={1}
                            placeholder="Añade un comentario..."
                            className="min-h-[44px] w-full resize-none border-b border-white/10 bg-transparent pb-3 text-sm text-white placeholder:text-zinc-500 focus:border-white/35 focus:outline-none"
                        />

                        {(composerActive || newCommentText) && (
                            <div className="mt-3 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setComposerActive(false);
                                        setNewCommentText("");
                                    }}
                                    className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-400 transition hover:bg-white/5 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePublishComment}
                                    disabled={!newCommentText.trim()}
                                    className="rounded-full bg-violet-500 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Comentar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {sortedComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            defaultSonicProfile={defaultSonicProfile}
                            artistsPerformance={artistsPerformance}
                            sonicImage={sonicImage}
                            sonicTitle={sonicTitle}
                            sonicSubtitle={sonicSubtitle}
                            onToggleLike={handleToggleLike}
                            onToggleReply={handleToggleReply}
                            onReplyDraftChange={handleReplyDraftChange}
                            onSubmitReply={handleSubmitReply}
                            onToggleReplies={handleToggleReplies}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SongCommentsThread;