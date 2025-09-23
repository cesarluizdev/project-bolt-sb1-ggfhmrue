import React, { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User, Package, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { cpf, cnpj } from 'cpf-cnpj-validator'

interface LoginPageProps {
  onBackToLanding?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [accountType, setAccountType] = useState<'cpf' | 'cnpj'>('cnpj')
  const [document, setDocument] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp } = useAuth()

  const validateDocument = () => accountType === 'cnpj' ? cnpj.isValid(document) : cpf.isValid(document)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) setError('Email ou senha incorretos. Tente novamente.')
      } else {
        if (!fullName.trim()) {
          setError(accountType === 'cnpj' ? 'Razão Social é obrigatória' : 'Nome do restaurante é obrigatório')
          setLoading(false)
          return
        }
        if (!validateDocument()) {
          setError(accountType === 'cnpj' ? 'CNPJ inválido' : 'CPF inválido')
          setLoading(false)
          return
        }

        // Aqui passamos os dados extras como objeto
        const { error } = await signUp(email, password, {
          fullName,
          document,
          accountType
        })

        if (error) {
          setError('Erro ao criar conta. Verifique os dados e tente novamente.')
        } else {
          setSuccess('Conta criada com sucesso! Faça login para continuar.')
          setIsLogin(true)
          setFullName('')
          setPassword('')
          setDocument('')
        }
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl mb-6">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Zentro Solution</h1>
          <p className="text-slate-300 text-lg">Sistema de monitoramento de pedidos</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="mb-6">
            <div className="flex bg-slate-800/50 rounded-lg p-1">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); setSuccess('') }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${isLogin ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-300 hover:text-white'}`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); setSuccess('') }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${!isLogin ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-300 hover:text-white'}`}
              >
                Criar Conta
              </button>
            </div>
          </div>

          {onBackToLanding && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onBackToLanding}
                className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
              >
                ← Voltar para página inicial
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-200 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* PF/PJ */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center text-slate-200 text-sm cursor-pointer">
                    <input type="radio" name="accountType" value="cnpj" checked={accountType === 'cnpj'} onChange={() => setAccountType('cnpj')} className="mr-2" />
                    Pessoa Jurídica (CNPJ)
                  </label>
                  <label className="flex items-center text-slate-200 text-sm cursor-pointer">
                    <input type="radio" name="accountType" value="cpf" checked={accountType === 'cpf'} onChange={() => setAccountType('cpf')} className="mr-2" />
                    Pessoa Física (CPF)
                  </label>
                </div>

                {/* Documento */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">{accountType === 'cnpj' ? 'CNPJ' : 'CPF'}</label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder={accountType === 'cnpj' ? '00.000.000/0001-00' : '000.000.000-00'}
                    required
                  />
                </div>

                {/* Nome/Razão Social */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">{accountType === 'cnpj' ? 'Razão Social' : 'Nome do Restaurante'}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder={accountType === 'cnpj' ? 'Razão Social da Empresa' : 'Nome Fantasia / Restaurante'}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isLogin && <p className="text-xs text-slate-400 mt-1">Mínimo de 6 caracteres</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
