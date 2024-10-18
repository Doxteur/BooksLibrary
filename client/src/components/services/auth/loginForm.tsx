'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail, AlertCircle } from "lucide-react"
import { Form, Field } from 'react-final-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../../app/reducers/AuthReducers'
import { AppDispatch, RootState } from '../../../app/store' // Assurez-vous que ce chemin est correct

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function PrettyLogin() {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    const result = await dispatch(login({ email: values.email, password: values.password })).unwrap()
    if (result.message === "Connexion réussie") {
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-orange-300 to-amber-400">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Lock className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue</h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        <Form<FormValues>
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Field name="email">
                {({ input, meta }) => (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Adresse email
                    </Label>
                    <div className="relative">
                      <Input
                        {...input}
                        id="email"
                        type="email"
                        placeholder="Entrez votre email"
                        className="pl-10 w-full"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {meta.touched && meta.error && <span className="text-red-500 text-sm">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="password">
                {({ input, meta }) => (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        {...input}
                        id="password"
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        className="pl-10 w-full"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {meta.touched && meta.error && <span className="text-red-500 text-sm">{meta.error}</span>}
                  </div>
                )}
              </Field>
              <div className="flex items-center justify-between">
                <Field name="rememberMe" type="checkbox">
                  {({ input }) => (
                    <div className="flex items-center">
                      <input
                        {...input}
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Se souvenir de moi
                      </Label>
                    </div>
                  )}
                </Field>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          )}
        />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" className="font-medium text-primary hover:text-primary/80">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
