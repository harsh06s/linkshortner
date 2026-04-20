import { useState } from 'react'

function App() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const handleShorten = async () => {
    if (!url) return alert("Bhai, URL toh dalo!");
    // Tera backend logic
    const res = await fetch(`http://127.0.0.1:8000/make-short?long_url=${url}`)
    const data = await res.json()
    setShortUrl(data.short_url)
    setIsCopied(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shortUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      {/* Glow Effect Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-[2rem] shadow-2xl">
        <h1 className="text-5xl font-black text-center mb-2 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent italic tracking-tighter">
          SHORTY
        </h1>
        <p className="text-center text-neutral-500 text-sm mb-8">Make your links clean & crisp</p>

        <div className="space-y-4">
          <input 
            className="w-full bg-neutral-800/50 border border-neutral-700 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-neutral-600"
            placeholder="Paste your long link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={handleShorten}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-neutral-200 active:scale-95 transition-all shadow-lg"
          >
            Shorten Link ⚡
          </button>
        </div>

        {shortUrl && (
          <div className="mt-8 bg-black/40 p-6 rounded-2xl border border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-4 font-bold">Your Short Link</p>
            <div className="flex items-center justify-between gap-4">
              <a href={shortUrl} target="_blank" className="text-blue-400 font-medium truncate hover:text-blue-300 transition-colors">
                {shortUrl}
              </a>
              <button 
                onClick={copyLink}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${isCopied ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}
              >
                {isCopied ? "Done! ✅" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-12 flex flex-col items-center gap-2">
        <div className="h-[1px] w-12 bg-neutral-800"></div>
        <p className="text-neutral-600 text-[10px] uppercase tracking-widest font-medium">Built by Harsh Sharma</p>
      </footer>
    </div>
  )
}

export default App