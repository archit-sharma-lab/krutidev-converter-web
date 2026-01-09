import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { convert } from "./converter/convert";

export default function App() {
  const [input, setInput] = useState("");
  const [font, setFont] = useState("krutidev");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

const handleConvert = async () => {
  setOutput("Converting...");
  setCopied(false);
  const result = await convert(input, font);
  setOutput(result);
};


  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-cardDark rounded-2xl shadow-xl p-6 space-y-6">

        {/* Title */}
        <h1 className="text-3xl font-semibold text-accent text-center">
          KrutiDev / DevLys Converter
        </h1>

        {/* Input */}
        <div>
          <label className="block mb-2 text-sm text-gray-300">
            Enter English / Hinglish text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. shiksha, tum kya kar rahe ho"
            rows={4}
            className="w-full rounded-lg bg-bgDark border border-gray-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Font Selector */}
        <div>
          <label className="block mb-2 text-sm text-gray-300">
            Select Output Font
          </label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full rounded-lg bg-bgDark border border-gray-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="krutidev">KrutiDev</option>
            <option value="devlys">DevLys</option>
          </select>
        </div>

        {/* Convert Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleConvert}
          className="w-full py-3 rounded-lg bg-accent text-black font-semibold hover:opacity-90 transition"
        >
          Convert
        </motion.button>

        {/* Output (ONLY after conversion) */}
        <AnimatePresence>
          {output && (
            <motion.div
              key="output"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <label className="block mb-2 text-sm text-gray-300">
                Output
              </label>

              <div className="relative">
                <textarea
                  value={output}
                  readOnly
                  rows={4}
                  className="w-full rounded-lg bg-bgDark border border-gray-700 p-3 text-white"
                />

                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 text-xs text-accent hover:underline"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
