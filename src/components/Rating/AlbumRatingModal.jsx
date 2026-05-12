'use client'

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Send, Star, X } from 'lucide-react'
import SongRatingModal from '@/components/Rating/SongRatingModal'
import { getRatingFont, getRatingHoverBorder } from '@/utils/getRatingStyle'
import { formatDuration, formatTotalDuration } from '@/utils/formatTime'

const getRatingLabel = (value) => {
    if (!value || value <= 0) return null
    if (value >= 9.6) return 'LEGENDARIO'
    if (value >= 9.0) return 'OBRA MAESTRA'
    if (value >= 8.6) return 'EXCELENTE'
    if (value >= 8.0) return 'MUY BUENO'
    if (value >= 7.0) return 'BUENO'
    if (value >= 6.0) return 'REGULAR'
    if (value >= 5.0) return 'MEDIOCRE'
    return 'MALO'
}

const clampRating = (value) => Math.min(10, Math.max(0.5, Math.round(value * 10) / 10))

const getDisplayValue = (selectedValue, previewValue, draftValue) => {
    if (previewValue !== null && previewValue !== undefined) return previewValue.toString()
    if (draftValue !== undefined) return draftValue
    return selectedValue > 0 ? selectedValue.toString() : ''
}

const inputTone = (value) => (
    value > 0 ? getRatingFont(value) : 'text-zinc-700 placeholder:text-zinc-700'
)

const glowColor = (value) => {
    if (!value || value <= 0) return 'rgba(63, 63, 70, 0)'
    if (value >= 9.6) return 'rgba(139, 92, 246, 0.8)'
    if (value >= 9.0) return 'rgba(56, 189, 248, 0.8)'
    if (value >= 8.0) return 'rgba(52, 211, 153, 0.8)'
    if (value >= 7.0) return 'rgba(250, 204, 21, 0.8)'
    if (value >= 6.0) return 'rgba(251, 146, 60, 0.8)'
    return 'rgba(239, 68, 68, 0.8)'
}

const glowMask = (isHalf) => (
    isHalf
        ? {
            WebkitMaskImage: 'linear-gradient(to right, #000 50%, transparent 50%)',
            maskImage: 'linear-gradient(to right, #000 50%, transparent 50%)',
        }
        : undefined
)

const StarRow = ({ value = 0, onChange, onPreviewChange, size = 20 }) => {
    const [hover, setHover] = useState(null)
    const display = hover ?? value

    const fillColor = (nextValue) => {
        if (!nextValue || nextValue <= 0) return 'text-zinc-700 fill-zinc-800/60'
        if (nextValue >= 9.6) return 'text-violet-500 fill-violet-500'
        if (nextValue >= 9.0) return 'text-sky-400 fill-sky-400'
        if (nextValue >= 8.0) return 'text-emerald-400 fill-emerald-400'
        if (nextValue >= 7.0) return 'text-yellow-400 fill-yellow-400'
        if (nextValue >= 6.0) return 'text-orange-400 fill-orange-400'
        if (nextValue >= 5.0) return 'text-red-500 fill-red-500'
        return 'text-red-800 fill-red-800'
    }

    return (
        <div
            className="flex items-center gap-[3px] select-none"
            onMouseLeave={() => {
                setHover(null)
                onPreviewChange?.(null)
            }}
        >
            {Array.from({ length: 10 }, (_, i) => {
                const n = i + 1
                const isFull = display >= n
                const isHalf = !isFull && display >= n - 0.5
                const active = isFull || isHalf
                const partialMask = glowMask(isHalf)
                const glowDiameter = Math.max(8, Math.round(size * 0.62))
                const glowOffset = Math.round((size - glowDiameter) / 2)

                return (
                    <button
                        key={i}
                        type="button"
                        style={{ width: size, height: size, flexShrink: 0, position: 'relative', overflow: 'visible' }}
                        className="cursor-pointer focus:outline-none appearance-none bg-transparent border-0 p-0 rounded-none shadow-none"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const nextValue = (e.clientX - rect.left) < rect.width / 2 ? n - 0.5 : n
                            setHover(nextValue)
                            onPreviewChange?.(nextValue)
                        }}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            onChange((e.clientX - rect.left) < rect.width / 2 ? n - 0.5 : n)
                        }}
                    >
                        <Star
                            style={{ width: size, height: size }}
                            className="text-zinc-700 fill-zinc-800/60"
                        />
                        {active && isFull && (
                            <span
                                className="absolute pointer-events-none rounded-full"
                                style={{
                                    left: `${glowOffset}px`,
                                    top: `${glowOffset}px`,
                                    width: `${glowDiameter}px`,
                                    height: `${glowDiameter}px`,
                                    backgroundColor: glowColor(display),
                                    filter: `blur(${Math.max(4, size * 0.12)}px)`,
                                    opacity: 0.8,
                                }}
                            />
                        )}
                        {(isFull || isHalf) && (
                            <Star
                                style={{ width: size, height: size, ...partialMask }}
                                className={`absolute inset-0 pointer-events-none ${fillColor(display)} transition-colors duration-150`}
                            />
                        )}
                    </button>
                )
            })}
        </div>
    )
}

const SectionLabel = ({ children }) => (
    <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
            {children}
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
)

const trackFeatureText = (track) => {
    if (!Array.isArray(track?.features) || track.features.length === 0) {
        return null
    }

    return track.features
}

const emptySubscribe = () => () => { }

export default function AlbumRatingModal({ isOpen, onClose, albumData, onSubmit }) {
    const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false)
    const [visible, setVisible] = useState(false)
    const [overall, setOverall] = useState(0)
    const [overallDraft, setOverallDraft] = useState(undefined)
    const [overallPreview, setOverallPreview] = useState(null)
    const [comment, setComment] = useState('')
    const [sonicRatings, setSonicRatings] = useState({})
    const [sonicDrafts, setSonicDrafts] = useState({})
    const [sonicPreviews, setSonicPreviews] = useState({})
    const [activeTrack, setActiveTrack] = useState(null)
    const [trackRatings, setTrackRatings] = useState({})
    const lockStylesRef = useRef(null)

    useEffect(() => {
        if (!isClient || !isOpen) return

        const { body, documentElement } = document
        const scrollbarWidth = window.innerWidth - documentElement.clientWidth
        lockStylesRef.current = {
            htmlOverflow: documentElement.style.overflow,
            overflow: body.style.overflow,
            bodyPaddingRight: body.style.paddingRight,
            bodyBackgroundColor: body.style.backgroundColor,
            scrollbarOffset: documentElement.style.getPropertyValue('--modal-scrollbar-offset'),
        }

        documentElement.style.overflow = 'hidden'
        documentElement.style.setProperty('--modal-scrollbar-offset', `${scrollbarWidth}px`)
        body.style.overflow = 'hidden'
        body.style.backgroundColor = '#0a0a0a'
        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`
        }

        const frame = requestAnimationFrame(() => setVisible(true))

        return () => {
            cancelAnimationFrame(frame)
            setVisible(false)

            const previous = lockStylesRef.current
            documentElement.style.overflow = previous?.htmlOverflow ?? ''
            if (previous?.scrollbarOffset) {
                documentElement.style.setProperty('--modal-scrollbar-offset', previous.scrollbarOffset)
            } else {
                documentElement.style.removeProperty('--modal-scrollbar-offset')
            }
            body.style.overflow = previous?.overflow ?? ''
            body.style.paddingRight = previous?.bodyPaddingRight ?? ''
            body.style.backgroundColor = previous?.bodyBackgroundColor ?? ''
        }
    }, [isClient, isOpen])

    if (!isClient || !isOpen) return null

    const setOverallRating = (value) => {
        const nextValue = clampRating(value)
        setOverall(nextValue)
        setOverallDraft(undefined)
    }

    const handleOverallChange = (e) => {
        const nextValue = e.target.value
        setOverallDraft(nextValue)
        const parsed = parseFloat(nextValue)
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 10) {
            setOverall(clampRating(parsed))
        }
    }

    const handleOverallBlur = () => {
        const parsed = parseFloat(overallDraft)
        if (isNaN(parsed) || parsed < 0.5) {
            setOverallDraft(undefined)
            return
        }

        setOverall(clampRating(parsed))
        setOverallDraft(undefined)
    }

    const setMetricPreview = (label, value) => {
        setSonicPreviews((prev) => {
            if (value === null) {
                const next = { ...prev }
                delete next[label]
                return next
            }
            return { ...prev, [label]: value }
        })
    }

    const handleMetricChange = (label, nextValue) => {
        setSonicDrafts((prev) => ({ ...prev, [label]: nextValue }))
        const parsed = parseFloat(nextValue)
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 10) {
            setSonicRatings((prev) => ({ ...prev, [label]: clampRating(parsed) }))
        }
    }

    const handleMetricBlur = (label) => {
        const parsed = parseFloat(sonicDrafts[label])
        if (isNaN(parsed) || parsed < 0.5) {
            setSonicDrafts((prev) => {
                const next = { ...prev }
                delete next[label]
                return next
            })
            return
        }

        setSonicRatings((prev) => ({ ...prev, [label]: clampRating(parsed) }))
        setSonicDrafts((prev) => {
            const next = { ...prev }
            delete next[label]
            return next
        })
    }

    const sonicProfile = [
        { label: "Ritmo", value: 0 },
        { label: "Flow", value: 0 },
        { label: "Letra", value: 0 },
        { label: "Producción", value: 0 },
        { label: "Impacto", value: 0 },
        { label: "Innovación", value: 0 },
    ]
    const tracks = albumData?.tracks ?? []
    const activeAlbumRating = overallPreview ?? overall
    const albumMeta = [
        albumData?.releaseYear,
        tracks.length > 0 ? `${tracks.length} tracks` : null,
        albumData?.duration ? formatTotalDuration(albumData.duration) : null,
    ].filter(Boolean)

    const buildSongModalData = (track) => ({
        id: track.id,
        title: track.title,
        image: track.image ?? albumData?.image,
        artist: track.artist ?? albumData?.artist,
        artistId: track.artistId ?? albumData?.artistId,
        artistImage: track.artistImage ?? albumData?.image,
        sonicProfile: sonicProfile,
        artistPerformance: track.artistPerformance ?? [],
        features: track.features ?? [],
    })

    const handleSubmit = () => {
        if (overall === 0) return
        onSubmit?.({
            overall,
            comment,
            sonicRatings,
            trackRatings,
        })
        onClose()
    }

    return createPortal(
        <>
            <div
                className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div
                    className="absolute inset-0 bg-black/75 backdrop-blur-2xl"
                    onClick={onClose}
                />

                <div
                    className={`relative w-full min-h-0 text-white sm:max-w-3xl bg-[#111111] border border-white/[0.08] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col max-h-[84vh] shadow-2xl shadow-black transition-all duration-300 ${visible
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'translate-y-5 scale-[0.98] opacity-0'
                        }`}
                >
                    <div className="relative rounded-t-[2.5rem] overflow-hidden shrink-0">
                        {albumData?.image && (
                            <div className="absolute inset-0">
                                <img
                                    src={albumData.image}
                                    alt=""
                                    className="w-full h-full object-cover scale-150 blur-3xl opacity-25"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-[#111111]" />
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/40 border border-white/10 hover:bg-black/70 transition-all cursor-pointer active:scale-90"
                        >
                            <X className="w-4 h-4 text-zinc-400" />
                        </button>

                        <div className="relative z-10 p-5 sm:p-6 pb-4 sm:pb-5 space-y-4">
                            <div className="flex items-start gap-4 min-w-0">
                                <img
                                    src={albumData?.image}
                                    alt={albumData?.title}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.4rem] object-cover border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.38)] shrink-0"
                                />
                                <div className="min-w-0 flex-1 space-y-2.5">
                                    <p className="text-[9px] font-black uppercase tracking-[0.38em] text-violet-400">
                                        Rate Album
                                    </p>
                                    <div className="space-y-1.5 min-w-0">
                                        <h2 className="text-2xl sm:text-3xl lg:text-[2.3rem] font-black tracking-tighter leading-[0.92] uppercase text-white overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                                            {albumData?.title}
                                        </h2>
                                        <p className="text-sm sm:text-base text-zinc-300 truncate">{albumData?.artist}</p>
                                    </div>
                                    {albumMeta.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
                                            {albumMeta.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-full border border-white/[0.08] bg-black/20 px-2.5 py-1 backdrop-blur-sm"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="rounded-[1.7rem] px-4 sm:px-5 ">

                            </div>


                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-6 pb-5 sm:pb-6 space-y-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div className="min-w-0 self-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500 mb-2">
                                    Overall Rating
                                </p>
                                <div className="overflow-x-auto overflow-y-hidden pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    <div className="min-w-max">
                                        <StarRow
                                            value={overall}
                                            onChange={setOverallRating}
                                            onPreviewChange={setOverallPreview}
                                            size={50}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 flex flex-col items-end sm:pl-4 self-center">
                                <input
                                    type="number"
                                    min="0.5"
                                    max="10"
                                    step="0.1"
                                    value={getDisplayValue(overall, overallPreview, overallDraft)}
                                    onChange={handleOverallChange}
                                    onBlur={handleOverallBlur}
                                    placeholder="—"
                                    className={`w-16 sm:w-[4.5rem] bg-transparent text-right pt-4 focus:outline-none text-4xl sm:text-5xl font-black leading-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition-colors duration-200 ${inputTone(activeAlbumRating)
                                        }`}
                                />
                                <p
                                    className={`min-h-[1.8rem] sm:min-h-[2rem] max-w-[7.5rem] text-[8px] sm:text-[9px] font-black uppercase tracking-[0.18em] leading-tight pb-1 transition-colors duration-200 ${activeAlbumRating > 0 ? getRatingFont(activeAlbumRating) : 'text-transparent'
                                        }`}
                                >
                                    {getRatingLabel(activeAlbumRating) ?? '\u00a0'}
                                </p>
                            </div>
                        </div>
                        <div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="¿Qué te pareció el proyecto?"
                                rows={3}
                                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.04] transition-all resize-none leading-relaxed"
                            />
                        </div>

                        {sonicProfile.length > 0 && (
                            <div>
                                <SectionLabel>Perfil Sonoro</SectionLabel>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {sonicProfile.map((metric) => {
                                        const value = sonicRatings[metric.label] ?? 0
                                        const previewValue = sonicPreviews[metric.label] ?? null
                                        const activeValue = previewValue ?? value

                                        return (
                                            <div
                                                key={metric.label}
                                                className="rounded-[1.3rem] border border-white/[0.06] bg-white/[0.03] px-3.5 py-3 hover:bg-white/[0.045] transition-colors group"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.22em] transition-colors ${activeValue > 0 ? getRatingFont(activeValue) : 'text-zinc-600 group-hover:text-zinc-500'
                                                        }`}>
                                                        {metric.label}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        min="0.5"
                                                        max="10"
                                                        step="0.1"
                                                        value={getDisplayValue(value, previewValue, sonicDrafts[metric.label])}
                                                        onChange={(e) => handleMetricChange(metric.label, e.target.value)}
                                                        onBlur={() => handleMetricBlur(metric.label)}
                                                        placeholder="—"
                                                        className={`w-10 bg-transparent focus:outline-none text-right shrink-0 text-sm font-black [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition-colors duration-150 ${inputTone(activeValue)
                                                            }`}
                                                    />
                                                </div>
                                                <div className="mt-3 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                                    <div className="min-w-max">
                                                        <StarRow
                                                            value={value}
                                                            onChange={(nextValue) =>
                                                                setSonicRatings((prev) => ({ ...prev, [metric.label]: nextValue }))
                                                            }
                                                            onPreviewChange={(nextValue) => setMetricPreview(metric.label, nextValue)}
                                                            size={24}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div>
                            <SectionLabel>Tracklist</SectionLabel>
                            <div className="space-y-2">
                                {tracks.map((track, index) => {
                                    const savedRating = trackRatings[track.id]
                                    const displayRating = savedRating ?? null
                                    const accentRating = savedRating ?? 0
                                    const features = trackFeatureText(track)
                                    return (
                                        <div
                                            key={track.id ?? `${track.title}-${index}`}
                                            className={`flex items-center gap-4 p-4 rounded-xl transition-all group cursor-default border border-transparent ${getRatingHoverBorder(accentRating)}`}
                                        >
                                            <span className={`w-6 text-sm font-bold text-center shrink-0 ${getRatingFont(accentRating)}`}>
                                                {(index + 1).toString().padStart(2, '0')}
                                            </span>

                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-bold uppercase tracking-tight truncate ${getRatingFont(accentRating)}`}>
                                                    {track.title}
                                                </h4>

                                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                                                        {track.artist ?? albumData?.artist}
                                                    </span>

                                                    {features && (
                                                        <>
                                                            <span className="text-[10px] text-zinc-700 font-black">FT.</span>
                                                            <div className="flex gap-1.5 flex-wrap">
                                                                {features.map((feature, featureIndex) => (
                                                                    <span
                                                                        key={`${track.id ?? track.title}-${featureIndex}`}
                                                                        className="text-[10px] text-zinc-700 font-bold uppercase tracking-wider"
                                                                    >
                                                                        {feature}{featureIndex < features.length - 1 ? ',' : ''}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <span className="text-xs text-zinc-500 font-mono w-12 text-right group-hover:text-zinc-300 shrink-0">
                                                {formatDuration(track.duration)}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => setActiveTrack(track)}
                                                className={`group h-[42px] w-[132px] shrink-0 rounded-2xl border px-3 transition-all cursor-pointer active:scale-95 ${displayRating !== null
                                                    ? 'border-white/[0.08] bg-white/[0.05] hover:border-white/[0.14] hover:bg-white/[0.08]'
                                                    : 'border-white/[0.07] bg-white/[0.025] text-zinc-300 hover:border-white/[0.12] hover:bg-white/[0.055]'
                                                    }`}
                                            >
                                                {displayRating !== null ? (
                                                    <div className="flex h-full items-center justify-between gap-2 w-full min-w-0">
                                                        <span className="text-[8px] font-black uppercase tracking-[0.18em] text-zinc-500 whitespace-nowrap leading-none">
                                                            Tu rating
                                                        </span>
                                                        <div className="flex items-center gap-1.5 shrink-0 leading-none min-w-fit">
                                                            <span className={`text-lg font-black italic ${getRatingFont(displayRating)}`}>
                                                                {displayRating.toFixed(1)}
                                                            </span>
                                                            <Star className={`w-4 h-4 fill-current opacity-90 ${getRatingFont(displayRating)}`} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-full items-center justify-center gap-2 w-full">
                                                        <Star className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300 group-hover:text-white transition-colors">
                                                            Calificar
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-6 py-5 border-t border-white/[0.05] shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] text-sm font-bold text-zinc-500 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={overall === 0}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-black text-white transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-900 disabled:text-zinc-700 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:shadow-none"
                        >
                            <Send className="w-4 h-4" />
                            Enviar calificación
                        </button>
                    </div>
                </div>
            </div>

            {activeTrack && (
                <SongRatingModal
                    isOpen={Boolean(activeTrack)}
                    onClose={() => setActiveTrack(null)}
                    initialOverall={trackRatings[activeTrack.id] ?? 0}
                    onSubmit={({ overall: nextOverall }) => {
                        setTrackRatings((prev) => ({ ...prev, [activeTrack.id]: nextOverall }))
                    }}
                    songData={buildSongModalData(activeTrack)}
                />
            )}
        </>,
        document.body
    )
}