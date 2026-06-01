"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  Send,
  QrCode,
  History,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
} from "lucide-react"

interface PiWalletIntegrationProps {
  currentLanguage: string
  userRegion: string
}

export default function PiWalletIntegration({ currentLanguage, userRegion }: PiWalletIntegrationProps) {
  const [activeTab, setActiveTab] = useState("wallet")
  const [showBalance, setShowBalance] = useState(true)
  const [sendAmount, setSendAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")

  const walletData = {
    balance: 15.7834,
    lockedBalance: 2.1567,
    pendingTransactions: 3,
    totalEarned: 45.2341,
    totalSpent: 29.4507,
    address: "GCKFBEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI7",
  }

  const transactions = [
    {
      id: "tx001",
      type: "received",
      amount: 0.008,
      from: "Dr. Moussa Koné",
      description: "Consultation vétérinaire",
      date: "2024-02-01T10:30:00Z",
      status: "completed",
      txHash: "abc123def456",
    },
    {
      id: "tx002",
      type: "sent",
      amount: 0.015,
      to: "Formation Aviculture",
      description: "Cours en ligne aviculture",
      date: "2024-01-30T14:20:00Z",
      status: "completed",
      txHash: "def456ghi789",
    },
    {
      id: "tx003",
      type: "received",
      amount: 0.012,
      from: "Ibrahim Sawadogo",
      description: "Service de conseil",
      date: "2024-01-28T09:15:00Z",
      status: "pending",
      txHash: "ghi789jkl012",
    },
    {
      id: "tx004",
      type: "sent",
      amount: 0.005,
      to: "Marché Local",
      description: "Achat d'aliments",
      date: "2024-01-25T16:45:00Z",
      status: "completed",
      txHash: "jkl012mno345",
    },
  ]

  const analytics = {
    monthlyEarnings: [
      { month: "Jan", amount: 12.5 },
      { month: "Fév", amount: 15.8 },
      { month: "Mar", amount: 18.2 },
      { month: "Avr", amount: 14.7 },
      { month: "Mai", amount: 22.1 },
      { month: "Juin", amount: 19.6 },
    ],
    topServices: [
      { service: "Consultation vétérinaire", earnings: 8.45, transactions: 23 },
      { service: "Formation aviculture", earnings: 6.78, transactions: 15 },
      { service: "Conseil technique", earnings: 4.32, transactions: 18 },
    ],
  }

  const handleSendPi = () => {
    if (!sendAmount || !recipientAddress) return
    console.log("Envoi de", sendAmount, "π à", recipientAddress)
    // Ici, vous intégreriez avec l'API Pi Network
    setSendAmount("")
    setRecipientAddress("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Afficher une notification de succès
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">π</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Portefeuille Pi Network</h2>
                <p className="text-purple-100">Connecté et sécurisé</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-2xl font-bold">
                  {showBalance ? `${walletData.balance.toFixed(4)}π` : "••••π"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-purple-100 text-sm">Solde disponible</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{walletData.lockedBalance.toFixed(4)}π</div>
              <p className="text-purple-100 text-sm">Solde bloqué</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{walletData.pendingTransactions}</div>
              <p className="text-purple-100 text-sm">Transactions en attente</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">Adresse du portefeuille:</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => copyToClipboard(walletData.address)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs font-mono mt-1 break-all">{walletData.address}</p>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wallet">Portefeuille</TabsTrigger>
          <TabsTrigger value="send">Envoyer</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={() => setActiveTab("send")}>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer π
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <QrCode className="h-4 w-4 mr-2" />
                  Recevoir π (QR Code)
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Demander un paiement
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Shield className="h-4 w-4 mr-2" />
                  Sécurité du portefeuille
                </Button>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Transactions récentes
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("history")}>
                    Voir tout
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === "received" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                        >
                          {tx.type === "received" ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tx.type === "received" ? tx.from : tx.to}</p>
                          <p className="text-xs text-gray-500">{tx.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "received" ? "+" : "-"}
                          {tx.amount}π
                        </p>
                        <div className="flex items-center">
                          {tx.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 text-orange-500 mr-1" />
                          )}
                          <span className="text-xs text-gray-500">{tx.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{walletData.totalEarned.toFixed(4)}π</div>
                <div className="text-sm text-gray-600">Total gagné</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{walletData.totalSpent.toFixed(4)}π</div>
                <div className="text-sm text-gray-600">Total dépensé</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(walletData.totalEarned - walletData.totalSpent).toFixed(4)}π
                </div>
                <div className="text-sm text-gray-600">Bénéfice net</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Envoyer des Pi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Adresse du destinataire</label>
                <Input
                  placeholder="Adresse Pi Network ou nom d'utilisateur"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Montant (π)</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.000"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    step="0.001"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">π</div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Solde disponible: {walletData.balance.toFixed(4)}π</p>
              </div>
              <div>
                <label className="text-sm font-medium">Description (optionnel)</label>
                <Input placeholder="Motif du paiement" />
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Vérifiez bien l'adresse du destinataire. Les transactions Pi sont irréversibles.
                  </p>
                </div>
              </div>
              <Button className="w-full" onClick={handleSendPi} disabled={!sendAmount || !recipientAddress}>
                Envoyer {sendAmount || "0"}π
              </Button>
            </CardContent>
          </Card>

          {/* Quick Send */}
          <Card>
            <CardHeader>
              <CardTitle>Envoi rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Dr. Moussa", address: "GCKF...TPI7", avatar: "M" },
                  { name: "Marie O.", address: "ABCD...XYZ9", avatar: "M" },
                  { name: "Ibrahim S.", address: "EFGH...UVW2", avatar: "I" },
                  { name: "Coopérative", address: "IJKL...RST5", avatar: "C" },
                ].map((contact, index) => (
                  <div
                    key={index}
                    className="text-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setRecipientAddress(contact.address)}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="font-semibold text-blue-600">{contact.avatar}</span>
                    </div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.address}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Historique des transactions
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm">
                    Exporter
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "received" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tx.type === "received" ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.type === "received" ? `Reçu de ${tx.from}` : `Envoyé à ${tx.to}`}
                        </p>
                        <p className="text-sm text-gray-600">{tx.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "received" ? "+" : "-"}
                        {tx.amount}π
                      </p>
                      <div className="flex items-center justify-end space-x-2">
                        <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                          {tx.status === "completed" ? "Terminé" : "En attente"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(tx.txHash)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Gains mensuels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.monthlyEarnings.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(month.amount / 25) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">{month.amount}π</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services les plus rentables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topServices.map((service, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{service.service}</h4>
                        <span className="font-bold text-green-600">{service.earnings}π</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{service.transactions} transactions</span>
                        <span>Moy: {(service.earnings / service.transactions).toFixed(3)}π</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé financier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">+{walletData.totalEarned.toFixed(2)}π</div>
                  <div className="text-sm text-green-700">Revenus totaux</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">-{walletData.totalSpent.toFixed(2)}π</div>
                  <div className="text-sm text-red-700">Dépenses totales</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {((walletData.totalEarned / walletData.totalSpent - 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-700">ROI</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{transactions.length}</div>
                  <div className="text-sm text-purple-700">Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
