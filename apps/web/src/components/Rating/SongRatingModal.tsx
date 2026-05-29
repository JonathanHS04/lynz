'use client'

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { X, Star, Send } from 'lucide-react'
import { getRatingFont } from '@/utils/getRatingStyle'
import { Song } from '@repo/types/src/artistsAlbumsSongs/song'

const getRatingLabel = (value: number) => {
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

const clampRating = (value: number) => Math.min(10, Math.max(0.5, Math.round(value * 10) / 10))

const getDisplayValue = (selectedValue: number, previewValue: number | null, draftValue: string | undefined) => {
    if (previewValue !== null && previewValue !== undefined) return previewValue.toString()
    if (draftValue !== undefined) return draftValue
    return selectedValue > 0 ? selectedValue.toString() : ''
}

const inputTone = (value: number) => (
    value > 0 ? getRatingFont(value) : 'text-zinc-700 placeholder:text-zinc-700'
)

const glowColor = (value: number) => {
    if (!value || value <= 0) return 'rgba(63, 63, 70, 0)'
    if (value >= 9.6) return 'rgba(139, 92, 246, 0.18)'
    if (value >= 9.0) return 'rgba(56, 189, 248, 0.17)'
    if (value >= 8.0) return 'rgba(52, 211, 153, 0.17)'
    if (value >= 7.0) return 'rgba(250, 204, 21, 0.16)'
    if (value >= 6.0) return 'rgba(251, 146, 60, 0.16)'
    return 'rgba(239, 68, 68, 0.16)'
}

const glowMask = (isHalf: boolean) => (
    isHalf
        ? {
            WebkitMaskImage: 'linear-gradient(to right, #000 50%, transparent 50%)',
            maskImage: 'linear-gradient(to right, #000 50%, transparent 50%)',
        }
        : undefined
)

const emptySubscribe = () => () => {}

const StarRow = ({ value = 0, onChange, onPreviewChange, size = 20 }: { value?: number; onChange?: (value: number) => void; onPreviewChange?: (value: number | null) => void; size?: number }) => {
    const [hover, setHover] = useState<number | null>(null)
    const display = hover ?? value

    const fillColor = (v: number) => {
        if (!v || v <= 0) return 'text-zinc-700 fill-zinc-800/60'
        if (v >= 9.6) return 'text-violet-500 fill-violet-500'
        if (v >= 9.0) return 'text-sky-400 fill-sky-400'
        if (v >= 8.0) return 'text-emerald-400 fill-emerald-400'
        if (v >= 7.0) return 'text-yellow-400 fill-yellow-400'
        if (v >= 6.0) return 'text-orange-400 fill-orange-400'
        if (v >= 5.0) return 'text-red-500 fill-red-500'
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

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
            {children}
        </span>
        <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
)

export default function SongRatingModal({ isOpen, onClose, songData, initialOverall = 0, onSubmit }: 
    { isOpen: boolean; onClose: () => void; songData: Song; initialOverall?: number; onSubmit?: (data: any) => void }) {
    const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false)
    const [visible, setVisible] = useState(false)
    const [overall, setOverall] = useState(initialOverall)
    const [overallDraft, setOverallDraft] = useState<string | undefined>(undefined)
    const [overallPreview, setOverallPreview] = useState<number | null>(null)
    const [comment, setComment] = useState('')
    const [sonicRatings, setSonicRatings] = useState({})
    const [sonicDrafts, setSonicDrafts] = useState({})
    const [sonicPreviews, setSonicPreviews] = useState({})
    const [artistRatings, setArtistRatings] = useState({})
    const [artistDrafts, setArtistDrafts] = useState({})
    const [artistPreviews, setArtistPreviews] = useState({})
    const lockStylesRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return
        setOverall(initialOverall)
        setOverallDraft(undefined)
        setOverallPreview(null)
    }, [initialOverall, isOpen])

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

    const setOverallRating = (val) => {
        const v = clampRating(val)
        setOverall(v)
        setOverallDraft(undefined)
    }

    const handleOverallChange = (e) => {
        const nextValue = e.target.value
        setOverallDraft(nextValue)
        const p = parseFloat(nextValue)
        if (!isNaN(p) && p >= 0.5 && p <= 10) {
            setOverall(clampRating(p))
        }
    }

    const handleOverallBlur = () => {
        const p = parseFloat(overallDraft)
        if (isNaN(p) || p < 0.5) {
            setOverallDraft(undefined)
        } else {
            const v = clampRating(p)
            setOverall(v)
            setOverallDraft(undefined)
        }
    }

    const setMapPreview = (setter, key, value) => {
        setter((prev) => {
            if (value === null) {
                const next = { ...prev }
                delete next[key]
                return next
            }
            return { ...prev, [key]: value }
        })
    }

    const handleMappedChange = (key, nextValue, setDrafts, setRatings) => {
        setDrafts((prev) => ({ ...prev, [key]: nextValue }))
        const parsed = parseFloat(nextValue)
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 10) {
            setRatings((prev) => ({ ...prev, [key]: clampRating(parsed) }))
        }
    }

    const handleMappedBlur = (key, drafts, setDrafts, setRatings) => {
        const parsed = parseFloat(drafts[key])
        if (isNaN(parsed) || parsed < 0.5) {
            setDrafts((prev) => {
                const next = { ...prev }
                delete next[key]
                return next
            })
            return
        }

        const nextValue = clampRating(parsed)
        setRatings((prev) => ({ ...prev, [key]: nextValue }))
        setDrafts((prev) => {
            const next = { ...prev }
            delete next[key]
            return next
        })
    }

    const sonicProfile = [
        { label: "Ritmo", value: 0},
        { label: "Flow", value: 0},
        { label: "Letra", value: 0},
        { label: "Producción", value: 0},
        { label: "Impacto", value: 0},
        { label: "Innovación", value: 0},
    ]

    let artists = [{
        id: songData?.artistId ?? songData?.artist ?? 'main-artist',
        name: songData?.artist,
        image: songData?.artistImage ?? songData?.image,
        role: 'Main Artist',
    }]
    if (songData?.features) {
        artists = artists.concat(songData.features.map((feature, index) => ({
            id: feature.id ?? `feature-${index}`,
            name: feature.name,
            image: feature.image ?? songData?.image,
            role: 'Feature',
        })))
    }

    const handleSubmit = () => {
        if (overall === 0) return
        onSubmit?.({
            overall,
            comment,
            sonicRatings,
            artistRatings,
        })
        onClose()
    }

    return createPortal(
        <div
            className={`fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 transition-all duration-300 ${
                visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-2xl"
                onClick={onClose}
            />

            <div
                className={`relative w-full text-white sm:max-w-xl bg-[#111111] border border-white/[0.08] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col max-h-[78vh] shadow-2xl shadow-black transition-all duration-300 ${
                    visible
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'translate-y-5 scale-[0.98] opacity-0'
                }`}
            >
                <div className="relative rounded-t-[2.5rem] overflow-hidden shrink-0">
                    {songData?.image && (
                        <div className="absolute inset-0">
                            <img
                                src={songData.image}
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

                    <div className="relative z-10 p-6 pb-7 space-y-5">
                        <div className="flex items-center gap-4">
                            <img
                                src={songData?.image}
                                alt={songData?.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-xl shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-violet-400 mb-1">
                                    Rate Track
                                </p>
                                <h2 className="text-xl font-black tracking-tight leading-tight truncate text-white">
                                    {songData?.name}
                                </h2>
                                <p className="text-sm text-zinc-400 truncate">{songData?.artist}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-5 space-y-7 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="flex items-center gap-4 justify-between">
                        <StarRow
                            value={overall}
                            onChange={setOverallRating}
                            onPreviewChange={setOverallPreview}
                            size={36}
                        />
                        <div className="shrink-0">
                            <input
                                type="number"
                                min="0.5"
                                max="10"
                                step="0.1"
                                value={getDisplayValue(overall, overallPreview, overallDraft)}
                                onChange={handleOverallChange}
                                onBlur={handleOverallBlur}
                                placeholder="—"
                                className={`w-14 bg-transparent focus:outline-none text-3xl font-black leading-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition-colors duration-200 ${
                                    inputTone(overallPreview ?? overall)
                                }`}
                            />
                            <p
                                className={`text-[9px] font-black uppercase tracking-widest mt-0.5 transition-colors duration-200 ${
                                    (overallPreview ?? overall) > 0 ? getRatingFont(overallPreview ?? overall) : 'text-transparent'
                                }`}
                            >
                                {getRatingLabel(overallPreview ?? overall) ?? '\u00a0'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="¿Qué te pareció?"
                            rows={3}
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.04] transition-all resize-none leading-relaxed"
                        />
                    </div>

                    {sonicProfile.length > 0 && (
                        <div>
                            <SectionLabel>Perfil Sonoro</SectionLabel>
                            <div className="space-y-0.5">
                                {sonicProfile.map((metric) => {
                                    const value = sonicRatings[metric.label] ?? 0
                                    const previewValue = sonicPreviews[metric.label] ?? null
                                    const activeValue = previewValue ?? value
                                    return (
                                        <div
                                            key={metric.label}
                                            className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className={`w-20 shrink-0 text-[10px] font-black uppercase tracking-widest transition-colors ${
                                                    activeValue > 0 ? getRatingFont(activeValue) : 'text-zinc-600 group-hover:text-zinc-500'
                                                }`}>
                                                    {metric.label}
                                                </span>
                                                <StarRow
                                                    value={value}
                                                    onChange={(nextValue) =>
                                                        setSonicRatings((prev) => ({ ...prev, [metric.label]: nextValue }))
                                                    }
                                                    onPreviewChange={(nextValue) => setMapPreview(setSonicPreviews, metric.label, nextValue)}
                                                    size={26}
                                                />
                                            </div>
                                            <input
                                                type="number"
                                                min="0.5"
                                                max="10"
                                                step="0.1"
                                                value={getDisplayValue(value, previewValue, sonicDrafts[metric.label])}
                                                onChange={(e) => handleMappedChange(metric.label, e.target.value, setSonicDrafts, setSonicRatings)}
                                                onBlur={() => handleMappedBlur(metric.label, sonicDrafts, setSonicDrafts, setSonicRatings)}
                                                placeholder="—"
                                                className={`w-10 bg-transparent focus:outline-none text-right shrink-0 text-sm font-black [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition-colors duration-150 ${
                                                    inputTone(previewValue ?? value)
                                                }`}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {artists.length > 0 && (
                        <div>
                            <SectionLabel>Artistas</SectionLabel>
                            <div className="space-y-2">
                                {artists.map((artist) => {
                                    const value = artistRatings[artist.id] ?? 0
                                    const previewValue = artistPreviews[artist.id] ?? null
                                    return (
                                        <div
                                            key={artist.id}
                                            className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all space-y-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={artist.image}
                                                    alt={artist.name}
                                                    className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-white truncate leading-tight">
                                                        {artist.name}
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                                                        {artist.role}
                                                    </p>
                                                </div>
                                                <input
                                                    type="number"
                                                    min="0.5"
                                                    max="10"
                                                    step="0.1"
                                                    value={getDisplayValue(value, previewValue, artistDrafts[artist.id])}
                                                    onChange={(e) => handleMappedChange(artist.id, e.target.value, setArtistDrafts, setArtistRatings)}
                                                    onBlur={() => handleMappedBlur(artist.id, artistDrafts, setArtistDrafts, setArtistRatings)}
                                                    placeholder="—"
                                                    className={`w-12 bg-transparent focus:outline-none text-right text-2xl font-black italic shrink-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none transition-colors duration-150 ${
                                                        inputTone(previewValue ?? value)
                                                    }`}
                                                />
                                            </div>
                                            <StarRow
                                                value={value}
                                                onChange={(nextValue) =>
                                                    setArtistRatings((prev) => ({ ...prev, [artist.id]: nextValue }))
                                                }
                                                onPreviewChange={(nextValue) => setMapPreview(setArtistPreviews, artist.id, nextValue)}
                                                size={28}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
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
        </div>,
        document.body
    )
}