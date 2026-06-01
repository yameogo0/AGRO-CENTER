"use client";

export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-green-500/20" />
            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-green-700">🌾 Agro Multicenter Hinos</h2>
          <p className="text-sm text-green-600">
            Chargement de votre espace agricole...
          </p>
        </div>
      </div>
    </div>
  );
}