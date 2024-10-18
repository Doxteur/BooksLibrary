'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Mail, Lock, User } from "lucide-react"
import { Link } from "react-router-dom"

export function PrettySignup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-orange-300 to-amber-400">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <UserPlus className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-600">Inscrivez-vous pour commencer</p>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                Prénom
              </Label>
              <div className="relative">
                <Input
                  id="first-name"
                  placeholder="Jean"
                  className="pl-10 w-full"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                Nom
              </Label>
              <div className="relative">
                <Input
                  id="last-name"
                  placeholder="Dupont"
                  className="pl-10 w-full"
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Adresse e-mail
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@exemple.com"
                className="pl-10 w-full"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                className="pl-10 w-full"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              required
            />
            <Label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              J'accepte les{" "}
              <Link to="/terms" className="font-medium text-primary hover:text-primary/80">
                conditions d'utilisation
              </Link>
            </Label>
          </div>
          <Button type="submit" className="w-full">
            S'inscrire
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
