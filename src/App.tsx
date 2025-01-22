import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Trash2, X, Settings } from 'lucide-react';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [frame, setFrame] = useState<string>('frame1');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newFrameName, setNewFrameName] = useState('');
  const [frames, setFrames] = useState({
    frame1: 'https://res.cloudinary.com/dre0vyh15/image/upload/v1737353892/vecteezy_social-media-beautiful-frame-design-with-red-love-and-blue_13473778_g8qerj.png', 
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newFrameName) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFrames(prev => ({
          ...prev,
          [newFrameName]: e.target?.result as string
        }));
        setNewFrameName('');
        if (frameInputRef.current) {
          frameInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseImage = new Image();
    const frameImage = new Image();
    baseImage.crossOrigin = "anonymous";
    frameImage.crossOrigin = "anonymous";

    baseImage.onload = () => {
      canvas.width = 500;
      canvas.height = 500;
      ctx.drawImage(baseImage, 0, 0, 500, 500);

      frameImage.onload = () => {
        ctx.drawImage(frameImage, 0, 0, 500, 500);
        const link = document.createElement('a');
        link.download = 'twibbon-image.png';
        link.href = canvas.toDataURL();
        link.click();
      };
      frameImage.src = frames[frame as keyof typeof frames];
    };
    baseImage.src = image;
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFrame = (keyToRemove: string) => {
    setFrames(prev => {
      const newFrames = { ...prev };
      delete newFrames[keyToRemove];
      return newFrames;
    });
    
    if (frame === keyToRemove) {
      setFrame(Object.keys(frames)[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-green-800 mb-4">"Celebrating 175 Years of Fide et Labore"</h1>
          <p className="text-gray-600">Add frames to your profile picture for the celebration</p>
          {/* <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className="absolute right-4 top-0 p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button> */}
        </div>

        {isAdminOpen && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Admin Panel - Upload Frames</h2>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frame Name
                </label>
                <input
                  type="text"
                  value={newFrameName}
                  onChange={(e) => setNewFrameName(e.target.value)}
                  placeholder="e.g., Summer Frame"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Frame Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={frameInputRef}
                  onChange={handleFrameUpload}
                  disabled={!newFrameName}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Available Frames</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(frames).map(([key, url]) => (
                  <div key={key} className="relative group">
                    <img 
                      src={url} 
                      alt={key} 
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => removeFrame(key)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-800 text-center">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Image</h2>
              {!image ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Image
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Frame</h2>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(frames).map(([key, src]) => (
                  <button
                    key={key}
                    onClick={() => setFrame(key)}
                    className={`p-2 rounded-lg border-2 ${
                      frame === key ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={src} alt={key} className="w-full h-24 object-cover rounded" />
                  </button>
                ))}
              </div>
            </div>

            {image && (
              <button
                onClick={handleDownload}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {image ? (
                <>
                  <img
                    src={image}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <img
                    src={frames[frame as keyof typeof frames]}
                    alt="Frame"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ImageIcon className="w-16 h-16" />
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;