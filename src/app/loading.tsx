export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-bali-cream">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-bali-sunset animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 rounded-full bg-bali-sunset animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 rounded-full bg-bali-sunset animate-bounce" />
        </div>
        <p className="font-serif text-lg text-bali-charcoal/40">正在加载...</p>
      </div>
    </div>
  );
}
