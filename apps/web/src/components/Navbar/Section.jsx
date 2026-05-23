function Section({ title, children }) {
  return (
    <div className="mb-4">
      <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
        {title}
      </p>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export default Section;