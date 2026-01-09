'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';

export function UploadFromCamera() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setResult(null);
      setError(null);
    }
  };

  const clearSelection = () => {
    setPreview(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/ai/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-md flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {!preview ? (
          <div className="flex flex-col gap-4">
            <div 
              className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Camera className="h-8 w-8 mb-2" />
                <p className="font-medium">Take Photo or Upload</p>
                <p className="text-xs">Invoices, Recipes, Sales Reports</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
              <Image 
                src={preview} 
                alt="Preview" 
                fill 
                className="object-contain" 
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={clearSelection}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!result && (
              <Button onClick={handleUpload} className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Process Image
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                <CheckCircle className="h-5 w-5" />
                Success!
              </div>
              
              {result.type === 'stock' && (
                <div className="text-sm text-green-800">
                  <p>Added {result.count} items to stock:</p>
                  <ul className="list-disc list-inside mt-1 max-h-32 overflow-y-auto">
                    {result.items.map((item: any) => (
                      <li key={item.id}>{item.quantity} {item.unit} {item.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.type === 'recipe' && (
                <div className="text-sm text-green-800">
                  <p>Created recipe: <strong>{result.recipe.name}</strong></p>
                  <p className="text-xs mt-1">{result.recipe.ingredients.length} ingredients</p>
                </div>
              )}

              {result.type === 'sales' && (
                <div className="text-sm text-green-800">
                  <p>Recorded sales for: <strong>{result.salesRecord.quantity}x {result.consumption[0]?.productName || 'Recipe'}</strong></p>
                  <p className="text-xs mt-1">Stock updated automatically.</p>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={clearSelection}
            >
              Scan Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
