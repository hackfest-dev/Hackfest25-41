import React from 'react'

export default function ReadmeFilee() {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className="border border-black w-[500px]">
        <div className="flex justify-between items-center border-b border-black px-2 py-1 bg-white">
          <span className="font-bold">README.md</span>
          <div className="space-x-2">
            <button className="border border-black px-2 text-xs font-bold">COPY</button>
            <button className="border border-black px-2 text-xs font-bold">DOWNLOAD</button>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center text-sm text-center p-4">
          this is the file done by ai in backend
        </div>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="ENTER THE PROMPT"
          className="border border-black px-4 py-2 w-96 font-bold"
        />
        <button className="border border-black px-4 py-2 font-bold">
          GOOO!!!
        </button>
      </div>
    </div>
  )
}
